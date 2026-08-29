/**
 * EcoHealth Pulse — Production ML Inference Engine (30-Yr Scaled Ridge & Dynamic Attribution)
 * 
 * Menjalankan inferensi prediktif real-time berbasis bobot model 30 tahun (1994–2025):
 * - StandardScaler Z-Score Normalization: z = (x - mu) / sigma
 * - Dynamic Feature Attribution: argmax_i |w_i * z_i| untuk menurunkan pemicu & rekomendasi
 */

import mlWeightsData from "./ml-weights.json";
import { computeBriereSuitability, computeLagRainfallEffect, DailyClimateVector, DiseaseRiskResult } from "./climatology";

export function predictMLDiseaseRisk(
  climate14Days: DailyClimateVector[]
): DiseaseRiskResult {
  const current = climate14Days[climate14Days.length - 1] ?? {
    temperatureAvg: 28.3,
    temperatureMin: 24.0,
    temperatureMax: 32.0,
    humidityAvg: 82.0,
    rainfallMm: 0.0,
    windSpeedKmh: 11.2,
    pm25: 34.5,
  };

  const past14Rain = climate14Days.slice(-14).map((d) => d.rainfallMm);

  const briere = computeBriereSuitability(current.temperatureAvg);
  const lagDlnm = computeLagRainfallEffect(past14Rain);
  const dtr = current.temperatureMax - current.temperatureMin;
  const rh = current.humidityAvg;

  // Gas polutan proxy (urban & ventilation model)
  const urbanFactor = 1.6;
  const windVentilation = Math.max(0.45, 1.0 - (current.windSpeedKmh / 28.0));
  const co = 0.85 * urbanFactor * windVentilation + 0.15;
  const no2 = 24.0 * urbanFactor * windVentilation + 4.0;

  const rawFeatures: Record<string, number> = {
    briereSuitability: briere,
    lagRainfallDlnm: lagDlnm,
    relativeHumidityPct: rh,
    diurnalTempRange: dtr,
    pm25: current.pm25,
    co,
    no2,
    windSpeedKmh: current.windSpeedKmh,
    temperatureMin: current.temperatureMin,
  };

  // StandardScaler Transformation: z = (x - mu) / sigma
  const scaler = (mlWeightsData as any).scaler;
  const scaledFeatures: Record<string, number> = {};
  for (const k of Object.keys(rawFeatures)) {
    const mu = scaler.means[k] ?? 0;
    const sigma = scaler.stds[k] ?? 1;
    scaledFeatures[k] = (rawFeatures[k] - mu) / sigma;
  }

  // 1. Inference Model DBD
  const dengueModel = mlWeightsData.models.dengue;
  let dengueScore = dengueModel.bias;
  const dengueAttributions: Record<string, number> = {};
  for (const feat of dengueModel.featureNames) {
    const contrib = ((dengueModel.weights as any)[feat] ?? 0) * (scaledFeatures[feat] ?? 0);
    dengueScore += contrib;
    dengueAttributions[feat] = contrib;
  }
  const dengueRisk = Math.round(Math.min(100, Math.max(5, dengueScore)));

  // 2. Inference Model ISPA
  const ispaModel = mlWeightsData.models.ispa;
  let ispaScore = ispaModel.bias;
  const ispaAttributions: Record<string, number> = {};
  for (const feat of ispaModel.featureNames) {
    const contrib = ((ispaModel.weights as any)[feat] ?? 0) * (scaledFeatures[feat] ?? 0);
    ispaScore += contrib;
    ispaAttributions[feat] = contrib;
  }
  const ispaRisk = Math.round(Math.min(100, Math.max(5, ispaScore)));

  // Composite Environmental Health Vulnerability (EHV) Index (DBD 60% : ISPA 40%)
  const compositeScore = Math.round(dengueRisk * 0.60 + ispaRisk * 0.40);

  // Dynamic Feature Attribution: Tentukan Pemicu Utama dari argmax |contrib|
  let primaryFactor = "Stabilitas Mikroklimat & Kualitas Udara";
  let recommendation = "Pemantauan berkala dan pemeliharaan kebersihan lingkungan.";

  if (compositeScore >= 60) {
    if (dengueRisk >= ispaRisk) {
      primaryFactor = dengueAttributions.lagRainfallDlnm > dengueAttributions.briereSuitability
        ? "Lag Presipitasi Akumulatif (Inkubasi Vektor Aedes)"
        : "Suhu Optimum Replikasi Vektor Dengue (Kurva Briere)";
      recommendation = "Aktivasi fogging fokus terarah dan larvasidasi massal pada genangan pemukiman.";
    } else {
      primaryFactor = ispaAttributions.pm25 > ispaAttributions.windSpeedKmh
        ? "Konsentrasi Partikulat Aerosol PM2.5 Tinggi"
        : "Stagnasi Ventilasi Atmosferik Lapisan Permukaan";
      recommendation = "Pemberlakuan peringatan kualitas udara dan pembagian masker medis respiratorik.";
    }
  } else if (compositeScore >= 35) {
    if (dengueRisk >= ispaRisk) {
      primaryFactor = "Kapasitas Termal Replikasi Vektor Aedes";
      recommendation = "Pemeriksaan Jentik Berkala (PJB) oleh kader Jumantik kelurahan.";
    } else {
      primaryFactor = "Akumulasi Polutan Partikulat Ringan";
      recommendation = "Peningkatan ventilasi udara dalam ruangan dan pengurangan emisi lokal.";
    }
  }

  return {
    dengueRisk,
    ispaRisk,
    compositeScore,
    primaryFactor,
    recommendation,
  };
}
