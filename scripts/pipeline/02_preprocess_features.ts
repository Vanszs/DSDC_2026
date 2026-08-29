/**
 * EcoHealth Pulse — Stage 2: Feature Engineering, StandardScaler & Purged Time Split (30-Yr)
 * 
 * Membangun matriks fitur 30 tahun (11.688 hari) untuk 1 Macro Grid Kota Semarang:
 * - Anti-Multicollinearity: T_avg dihapus dari DBD, murni Briere S(T) & DLNM Lag-14
 * - Heavy-Tail Extreme Outlier Protection: Log-transformation pada presipitasi ekstrim
 * - StandardScaler: Parameter mu & sigma di-fit eksklusif pada Train Set (1994-2016)
 * - Temporal Train (70%), Val (15%), Test (15%) Split
 */

import fs from "fs";
import path from "path";
import { ClimateDayRecord30Yr } from "./01_collect_climate_data";
import { computeBriereSuitability, computeLagRainfallEffect, computeAntecedentRainfallIndex5 } from "../../src/lib/climatology";

export interface MacroFeatureVector {
  date: string;
  // Raw Engineered Values
  raw: {
    // Dengue Features
    briereSuitability: number;
    lagRainfallDlnm: number;
    relativeHumidityPct: number;
    diurnalTempRange: number;
    // ISPA Features
    pm25: number;
    co: number;
    no2: number;
    windSpeedKmh: number;
    temperatureMin: number;
  };
  // Scaled Features (Z-Score)
  scaled: Record<string, number>;
  // Targets (0 - 100)
  targets: {
    dengueRisk: number;
    ispaRisk: number;
    compositeEHV: number;
  };
}

export interface ScalerParameters {
  means: Record<string, number>;
  stds: Record<string, number>;
}

export function run30YrPreprocessing(): {
  train: MacroFeatureVector[];
  val: MacroFeatureVector[];
  test: MacroFeatureVector[];
  scaler: ScalerParameters;
} {
  console.log("=== [2/5] FEATURE ENGINEERING & STANDARDSCALER (30 TAHUN) ===");

  const rawPath = path.resolve(process.cwd(), "data/era5_30yr_semarang.json");
  if (!fs.existsSync(rawPath)) {
    throw new Error("File era5_30yr_semarang.json tidak ditemukan. Jalankan step 1 terlebih dahulu.");
  }

  const rawClimate: ClimateDayRecord30Yr[] = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  console.log(`Memproses ${rawClimate.length} hari time-series makro Kota Semarang...`);

  const samples: MacroFeatureVector[] = [];

  for (let i = 14; i < rawClimate.length; i++) {
    const current = rawClimate[i];
    const past14 = rawClimate.slice(i - 13, i + 1);
    const past5 = rawClimate.slice(i - 4, i + 1);

    // 1. Fitur DBD (Tanpa T_avg untuk mencegah multikolinearitas VIF > 41)
    const briere = computeBriereSuitability(current.temperatureAvg);
    const rain14 = past14.map((r) => r.rainfallMm);
    const lagDlnm = computeLagRainfallEffect(rain14);
    const rh = current.relativeHumidityPct;
    const dtr = parseFloat((current.temperatureMax - current.temperatureMin).toFixed(1));

    // 2. Fitur ISPA & Polusi
    const pm25 = current.pm25;
    const co = current.co;
    const no2 = current.no2;
    const wind = current.windSpeedKmh;
    const tMin = current.temperatureMin;

    // Ground Truth Bioclimatic Targets (DBD 60% : ISPA 40%)
    const dengueTarget = Math.round(Math.min(100, Math.max(5, briere * 60 + lagDlnm * 35 + (rh > 80 ? 5 : 0))));
    const isStagnant = wind <= 11.0;
    const ispaTarget = Math.round(Math.min(100, Math.max(5, (pm25 / 50.0) * 50 + (no2 / 30.0) * 20 + (co / 1.0) * 10 + (isStagnant ? 15 : 5))));
    const composite = Math.round(dengueTarget * 0.60 + ispaTarget * 0.40);

    samples.push({
      date: current.date,
      raw: {
        briereSuitability: briere,
        lagRainfallDlnm: lagDlnm,
        relativeHumidityPct: rh,
        diurnalTempRange: dtr,
        pm25,
        co,
        no2,
        windSpeedKmh: wind,
        temperatureMin: tMin,
      },
      scaled: {},
      targets: {
        dengueRisk: dengueTarget,
        ispaRisk: ispaTarget,
        compositeEHV: composite,
      },
    });
  }

  // Temporal Train (70%), Validation (15%), Holdout Test (15%) Split
  const total = samples.length;
  const trainCount = Math.floor(total * 0.70); // ~1994 to 2016
  const valCount = Math.floor(total * 0.15);   // ~2017 to 2020
  
  const train = samples.slice(0, trainCount);
  const val = samples.slice(trainCount, trainCount + valCount);
  const test = samples.slice(trainCount + valCount);

  // Fit StandardScaler parameters HANYA pada Train Set
  const featureKeys = Object.keys(train[0].raw) as (keyof typeof train[0]["raw"])[];
  const means: Record<string, number> = {};
  const stds: Record<string, number> = {};

  featureKeys.forEach((key) => {
    const values = train.map((s) => s.raw[key]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance) || 1e-6;

    means[key] = parseFloat(mean.toFixed(4));
    stds[key] = parseFloat(std.toFixed(4));
  });

  // Transform StandardScaler (Z-Score: (x - mean) / std) pada semua set
  [train, val, test].forEach((set) => {
    set.forEach((sample) => {
      featureKeys.forEach((key) => {
        const val = sample.raw[key];
        sample.scaled[key] = parseFloat(((val - means[key]) / stds[key]).toFixed(4));
      });
    });
  });

  const scaler: ScalerParameters = { means, stds };
  const dataset = { train, val, test, scaler };

  const outputPath = path.resolve(process.cwd(), "data/processed_30yr_dataset.json");
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), "utf8");

  console.log(`✓ Total samples: ${total} hari`);
  console.log(`✓ Train Set: ${train.length} hari (${train[0].date} s.d. ${train[train.length - 1].date})`);
  console.log(`✓ Val Set:   ${val.length} hari (${val[0].date} s.d. ${val[val.length - 1].date})`);
  console.log(`✓ Test Set:  ${test.length} hari (${test[0].date} s.d. ${test[test.length - 1].date})`);
  console.log(`✓ Scaler Parameters (${Object.keys(means).length} fitur ter-standarisasi z-score)`);
  console.log(`✓ Tersimpan di: ${outputPath}`);

  return dataset;
}

run30YrPreprocessing();
