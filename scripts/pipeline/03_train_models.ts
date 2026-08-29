/**
 * EcoHealth Pulse — Stage 3: Regularized Model Training Pipeline (30-Yr Scaled Data)
 * 
 * Melatih model regresi L2 Ridge pada fitur yang telah ter-standarisasi Z-score (mu=0, sigma=1):
 * - Intercept Unregularized (lambda pada bias = 0)
 * - Scaler parameters disimpan ke ml-weights.json untuk inferensi real-time runtime
 */

import fs from "fs";
import path from "path";
import { MacroFeatureVector, ScalerParameters } from "./02_preprocess_features";

export interface NormalizedModelCoefficients {
  featureNames: string[];
  weights: Record<string, number>;
  bias: number;
}

export interface ProductionTrainedModelSuite {
  version: string;
  trainedAt: string;
  trainingSpan: string;
  datasetSize: { train: number; val: number; test: number };
  scaler: ScalerParameters;
  climatologicalBaseline: {
    temperatureAvg: number;
    rainfallMm: number;
    relativeHumidityPct: number;
    windSpeedKmh: number;
    pm25: number;
  };
  models: {
    dengue: NormalizedModelCoefficients;
    ispa: NormalizedModelCoefficients;
  };
}

// Pure TypeScript Linear Algebra Helpers
function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function matrixTranspose(A: number[][]): number[][] {
  return A[0].map((_, colIndex) => A.map((row) => row[colIndex]));
}

// Inversi Matriks dengan L2 Ridge Penalty hanya pada bobot fitur (bukan pada bias kolom 0)
function invertMatrixWithUnregularizedBias(A: number[][], lambda: number = 0.01): number[][] {
  const n = A.length;
  const M: number[][] = Array.from({ length: n }, (_, i) => [
    ...A[i].map((val, j) => val + (i === j && i > 0 ? lambda : 0)), // Kolom 0 (bias) tanpa penalti lambda
    ...Array.from({ length: n }, (__, j) => (i === j ? 1 : 0)),
  ]);

  for (let i = 0; i < n; i++) {
    let pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) {
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(M[r][i]) > Math.abs(pivot)) {
          [M[i], M[r]] = [M[r], M[i]];
          pivot = M[i][i];
          break;
        }
      }
    }

    const invPivot = 1.0 / (pivot || 1e-10);
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] *= invPivot;
    }

    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const factor = M[r][i];
        for (let j = 0; j < 2 * n; j++) {
          M[r][j] -= factor * M[i][j];
        }
      }
    }
  }

  return M.map((row) => row.slice(n));
}

// Train Ridge Regression pada Scaled Features
function trainRidgeRegression(
  X: number[][],
  Y: number[],
  featureNames: string[],
  lambda: number = 0.01
): NormalizedModelCoefficients {
  const X_with_bias = X.map((row) => [1, ...row]);
  const X_T = matrixTranspose(X_with_bias);
  const XTX = matrixMultiply(X_T, X_with_bias);
  const XTX_inv = invertMatrixWithUnregularizedBias(XTX, lambda);

  const Y_col = Y.map((y) => [y]);
  const XTY = matrixMultiply(X_T, Y_col);

  const W_mat = matrixMultiply(XTX_inv, XTY);
  const bias = parseFloat(W_mat[0][0].toFixed(4));
  const weights: Record<string, number> = {};

  featureNames.forEach((feat, idx) => {
    weights[feat] = parseFloat(W_mat[idx + 1][0].toFixed(4));
  });

  return { featureNames, weights, bias };
}

export function run30YrTraining(): ProductionTrainedModelSuite {
  console.log("=== [3/5] TRAINING MODEL RIDGE PADA 30 TAHUN DATA SCALED ===");

  const datasetPath = path.resolve(process.cwd(), "data/processed_30yr_dataset.json");
  if (!fs.existsSync(datasetPath)) {
    throw new Error("File processed_30yr_dataset.json tidak ditemukan. Jalankan step 2 terlebih dahulu.");
  }

  const { train, val, test, scaler } = JSON.parse(fs.readFileSync(datasetPath, "utf8")) as {
    train: MacroFeatureVector[];
    val: MacroFeatureVector[];
    test: MacroFeatureVector[];
    scaler: ScalerParameters;
  };

  console.log(`Melatih model pada ${train.length} training days (1994–2016)...`);

  // 1. Model DBD Features: Briere S(T), DLNM Lag-14, Relative Humidity, Diurnal Range
  const dengueFeatures = ["briereSuitability", "lagRainfallDlnm", "relativeHumidityPct", "diurnalTempRange"];
  const buildMatrix = (samples: MacroFeatureVector[], keys: string[]): number[][] => {
    return samples.map((s) => keys.map((k) => s.scaled[k] ?? 0));
  };

  const X_dengue = buildMatrix(train, dengueFeatures);
  const Y_dengue = train.map((s) => s.targets.dengueRisk);
  const modelDengue = trainRidgeRegression(X_dengue, Y_dengue, dengueFeatures, 0.005);
  console.log("✓ Model DBD Weights:", modelDengue.weights, "Bias:", modelDengue.bias);

  // 2. Model ISPA Features: PM2.5, CO, NO2, Wind Speed, Temperature Min
  const ispaFeatures = ["pm25", "co", "no2", "windSpeedKmh", "temperatureMin"];
  const X_ispa = buildMatrix(train, ispaFeatures);
  const Y_ispa = train.map((s) => s.targets.ispaRisk);
  const modelIspa = trainRidgeRegression(X_ispa, Y_ispa, ispaFeatures, 0.005);
  console.log("✓ Model ISPA Weights:", modelIspa.weights, "Bias:", modelIspa.bias);

  const modelSuite: ProductionTrainedModelSuite = {
    version: "3.1.0-30yr-dual-disease",
    trainedAt: new Date().toISOString(),
    trainingSpan: "1994-01-15 s.d. 2016-05-29 (8.171 hari)",
    datasetSize: { train: train.length, val: val.length, test: test.length },
    scaler,
    climatologicalBaseline: {
      temperatureAvg: 28.3,
      rainfallMm: 6.8,
      relativeHumidityPct: 82.1,
      windSpeedKmh: 11.2,
      pm25: 34.5,
    },
    models: {
      dengue: modelDengue,
      ispa: modelIspa,
    },
  };

  const outputPath = path.resolve(process.cwd(), "src/lib/ml-weights.json");
  fs.writeFileSync(outputPath, JSON.stringify(modelSuite, null, 2), "utf8");
  console.log(`✓ Model weights dan scaler parameter tersimpan di: ${outputPath}`);

  return modelSuite;
}

run30YrTraining();
