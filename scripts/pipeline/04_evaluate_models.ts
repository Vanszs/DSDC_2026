/**
 * EcoHealth Pulse — Stage 4: 30-Year Model Validation on Holdout Test Set (2021–2025)
 * 
 * Menguji performa model inferensi pada 1.752 hari holdout test set (5 tahun independen):
 * - R² Score, MAE, RMSE untuk regresi kontinu risiko
 * - Precision, Recall, F1-Score untuk klasifikasi Triage Siaga (EHV >= 60)
 */

import fs from "fs";
import path from "path";
import { MacroFeatureVector } from "./02_preprocess_features";
import { ProductionTrainedModelSuite, NormalizedModelCoefficients } from "./03_train_models";

export interface EvaluationMetric {
  r2Score: number;
  mae: number;
  rmse: number;
}

export interface ClassificationMetric {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export interface Full30YrEvaluationReport {
  evaluatedAt: string;
  testPeriod: string;
  testSamplesCount: number;
  metrics: {
    dengue: EvaluationMetric;
    ispa: EvaluationMetric;
    compositeEHV: EvaluationMetric;
  };
  triageAlertClassification: ClassificationMetric;
}

function predictSingleScaled(model: NormalizedModelCoefficients, scaledFeatures: Record<string, number>): number {
  let score = model.bias;
  for (const feat of model.featureNames) {
    score += (model.weights[feat] ?? 0) * (scaledFeatures[feat] ?? 0);
  }
  return Math.min(100, Math.max(5, score));
}

function computeMetrics(yTrue: number[], yPred: number[]): EvaluationMetric {
  const n = yTrue.length;
  const meanTrue = yTrue.reduce((a, b) => a + b, 0) / n;

  let ssTot = 0;
  let ssRes = 0;
  let absErrorSum = 0;
  let sqErrorSum = 0;

  for (let i = 0; i < n; i++) {
    const err = yTrue[i] - yPred[i];
    ssRes += err * err;
    ssTot += Math.pow(yTrue[i] - meanTrue, 2);
    absErrorSum += Math.abs(err);
    sqErrorSum += err * err;
  }

  const r2Score = parseFloat((1 - ssRes / (ssTot || 1e-10)).toFixed(4));
  const mae = parseFloat((absErrorSum / n).toFixed(3));
  const rmse = parseFloat(Math.sqrt(sqErrorSum / n).toFixed(3));

  return { r2Score, mae, rmse };
}

export function run30YrEvaluation(): Full30YrEvaluationReport {
  console.log("=== [4/5] EVALUASI MODEL PADA HOLDOUT TEST SET 2021–2025 ===");

  const datasetPath = path.resolve(process.cwd(), "data/processed_30yr_dataset.json");
  const weightsPath = path.resolve(process.cwd(), "src/lib/ml-weights.json");

  if (!fs.existsSync(datasetPath) || !fs.existsSync(weightsPath)) {
    throw new Error("Dataset atau ML weights belum ditemukan. Jalankan step 2 dan 3 terlebih dahulu.");
  }

  const { test } = JSON.parse(fs.readFileSync(datasetPath, "utf8")) as { test: MacroFeatureVector[] };
  const { models } = JSON.parse(fs.readFileSync(weightsPath, "utf8")) as ProductionTrainedModelSuite;

  console.log(`Mengevaluasi pada ${test.length} hari holdout test set (${test[0].date} s.d. ${test[test.length - 1].date})...`);

  const dengueTrue: number[] = [];
  const denguePred: number[] = [];
  const ispaTrue: number[] = [];
  const ispaPred: number[] = [];
  const compTrue: number[] = [];
  const compPred: number[] = [];

  let tp = 0, fp = 0, fn = 0, tn = 0;

  test.forEach((s) => {
    const dPred = predictSingleScaled(models.dengue, s.scaled);
    const iPred = predictSingleScaled(models.ispa, s.scaled);
    const cPred = Math.round(dPred * 0.60 + iPred * 0.40);

    dengueTrue.push(s.targets.dengueRisk);
    denguePred.push(dPred);

    ispaTrue.push(s.targets.ispaRisk);
    ispaPred.push(iPred);

    compTrue.push(s.targets.compositeEHV);
    compPred.push(cPred);

    // Triage Siaga Alert Classification (EHV >= 60)
    const isAlertTrue = s.targets.compositeEHV >= 60;
    const isAlertPred = cPred >= 60;

    if (isAlertTrue && isAlertPred) tp++;
    else if (!isAlertTrue && isAlertPred) fp++;
    else if (isAlertTrue && !isAlertPred) fn++;
    else tn++;
  });

  const dengueMetrics = computeMetrics(dengueTrue, denguePred);
  const ispaMetrics = computeMetrics(ispaTrue, ispaPred);
  const compMetrics = computeMetrics(compTrue, compPred);

  const precision = parseFloat((tp / (tp + fp || 1)).toFixed(4));
  const recall = parseFloat((tp / (tp + fn || 1)).toFixed(4));
  const f1Score = parseFloat(((2 * precision * recall) / (precision + recall || 1)).toFixed(4));
  const accuracy = parseFloat(((tp + tn) / (tp + tn + fp + fn || 1)).toFixed(4));

  const report: Full30YrEvaluationReport = {
    evaluatedAt: new Date().toISOString(),
    testPeriod: `${test[0].date} s.d. ${test[test.length - 1].date}`,
    testSamplesCount: test.length,
    metrics: {
      dengue: dengueMetrics,
      ispa: ispaMetrics,
      compositeEHV: compMetrics,
    },
    triageAlertClassification: {
      precision,
      recall,
      f1Score,
      accuracy,
      truePositives: tp,
      falsePositives: fp,
      falseNegatives: fn,
      trueNegatives: tn,
    },
  };

  console.log("--------------------------------------------------");
  console.log(`HASIL EVALUASI 5 TAHUN HOLDOUT TEST (${test[0].date} - ${test[test.length - 1].date}):`);
  console.log(`- Model DBD   : R² = ${dengueMetrics.r2Score} | MAE = ${dengueMetrics.mae} | RMSE = ${dengueMetrics.rmse}`);
  console.log(`- Model ISPA  : R² = ${ispaMetrics.r2Score} | MAE = ${ispaMetrics.mae} | RMSE = ${ispaMetrics.rmse}`);
  console.log(`- Skor EHV    : R² = ${compMetrics.r2Score} | MAE = ${compMetrics.mae} | RMSE = ${compMetrics.rmse}`);
  console.log("--------------------------------------------------");
  console.log("KLASIFIKASI TRIAGE SIAGA (EHV >= 60):");
  console.log(`- Accuracy  : ${(accuracy * 100).toFixed(1)}%`);
  console.log(`- Precision : ${(precision * 100).toFixed(1)}% (${tp}/${tp + fp})`);
  console.log(`- Recall    : ${(recall * 100).toFixed(1)}% (${tp}/${tp + fn})`);
  console.log(`- F1-Score  : ${(f1Score * 100).toFixed(1)}%`);
  console.log("--------------------------------------------------");

  const reportPath = path.resolve(process.cwd(), "data/evaluation_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`✓ Laporan Evaluasi tersimpan di: ${reportPath}`);

  return report;
}

run30YrEvaluation();
