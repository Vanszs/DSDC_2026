/**
 * EcoHealth Pulse — Production ML Inference Engine (30-Yr Scaled Ridge & Dynamic Attribution)
 * 
 * Menjalankan inferensi prediktif real-time berbasis bobot model 30 tahun (1994–2025):
 * - StandardScaler Z-Score Normalization: z = (x - mu) / sigma
 * - Dynamic Feature Attribution: argmax_i |w_i * z_i| untuk menurunkan pemicu & rekomendasi
 */

import mlWeightsData from "./ml-weights.json";
import { computeBriereSuitability, computeLagRainfallEffect, DailyClimateVector, DiseaseRiskResult } from "./climatology";

export interface DistrictVulnerabilityContext {
  population?: number;
  areaKm2?: number;
  sanitationIndex?: number;
  isCoastalRobRisk?: boolean;
}

export function predictMLDiseaseRisk(
  climate14Days: DailyClimateVector[],
  context?: DistrictVulnerabilityContext
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

  // 2. Inference Model ISPA
  const ispaModel = mlWeightsData.models.ispa;
  let ispaScore = ispaModel.bias;
  const ispaAttributions: Record<string, number> = {};
  for (const feat of ispaModel.featureNames) {
    const contrib = ((ispaModel.weights as any)[feat] ?? 0) * (scaledFeatures[feat] ?? 0);
    ispaScore += contrib;
    ispaAttributions[feat] = contrib;
  }

  // 1. Layer 1: Bioclimatic ML Hazard Score
  const rawDengueHazard = dengueScore;
  const rawIspaHazard = ispaScore;

  // 2. Layer 2: Spatial Exposure & Vulnerability Integration (WHO/IPCC Framework)
  let finalDengueRisk = Math.round(Math.min(100, Math.max(5, rawDengueHazard)));
  let finalIspaRisk = Math.round(Math.min(100, Math.max(5, rawIspaHazard)));

  if (context && (context.population || context.sanitationIndex !== undefined)) {
    const pop = context.population || 80000;
    const area = context.areaKm2 || 15.0;
    const density = pop / Math.max(1, area); // Jiwa / km2
    // Normalisasi kepadatan Kota Semarang (rentang 1.300 s.d 11.000 jiwa/km2)
    const densityFactor = Math.min(1.20, Math.max(0.85, 0.85 + (density / 10000) * 0.35));

    // Sanitasi & Rob modifier
    const sanitation = context.sanitationIndex ?? 0.75;
    const sanitationPenalty = (1.0 - sanitation) * 15; // 0 s.d 6 poin tambahan jika sanitasi buruk
    const robBonus = context.isCoastalRobRisk ? 5 : 0;

    finalDengueRisk = Math.round(Math.min(100, Math.max(5, rawDengueHazard * densityFactor * 0.90 + sanitationPenalty + robBonus)));
    finalIspaRisk = Math.round(Math.min(100, Math.max(5, rawIspaHazard * densityFactor * 0.95)));
  }

  // Composite Environmental Health & Stability Score (0 = Ekstrim Bahaya/Kritis, 100 = Optimal/Sangat Stabil & Aman)
  // Dihitung dengan menginversi beban risiko komposit: Indeks Stabilitas = 100 - Beban Risiko Komposit
  const rawRiskLoad = Math.round(finalDengueRisk * 0.60 + finalIspaRisk * 0.40);
  const compositeScore = Math.max(0, Math.min(100, 100 - rawRiskLoad));

  // Dynamic Feature Attribution: Tentukan Pemicu Utama dari argmax (kontribusi risiko positif terbesar)
  let primaryFactor = "Stabilitas Mikroklimat & Kualitas Udara Optimal";
  let recommendation = "Pertahankan sanitasi lingkungan dan monitoring berkala.";

  const maxDengueKey = dengueModel.featureNames.reduce((best, f) =>
    (dengueAttributions[f] ?? 0) > (dengueAttributions[best] ?? 0) ? f : best,
    dengueModel.featureNames[0]
  );

  const maxIspaKey = ispaModel.featureNames.reduce((best, f) =>
    (ispaAttributions[f] ?? 0) > (ispaAttributions[best] ?? 0) ? f : best,
    ispaModel.featureNames[0]
  );

  // Semakin KECIL compositeScore, semakin TINGGI tingkat bahayanya
  if (compositeScore <= 35) { // Bahaya Tinggi / Kritis (Beban Risiko >= 65)
    if (finalDengueRisk >= finalIspaRisk) {
      if (maxDengueKey === "lagRainfallDlnm") {
        primaryFactor = "Lag Presipitasi Akumulatif (Inkubasi Vektor Aedes)";
      } else if (maxDengueKey === "briereSuitability") {
        primaryFactor = "Suhu Optimum Replikasi Vektor Dengue (Kurva Briere)";
      } else if (maxDengueKey === "relativeHumidityPct") {
        primaryFactor = "Kelembapan Relatif Ekstrim Mendukung Daya Tahan Nyamuk";
      } else {
        primaryFactor = "Fluktuasi Suhu Harian Mendukung Transmisi Vektor";
      }
      recommendation = "Aktivasi fogging fokus terarah dan larvasidasi massal pada genangan pemukiman.";
    } else {
      if (maxIspaKey === "pm25") {
        primaryFactor = "Konsentrasi Partikulat Aerosol PM2.5 Tinggi";
      } else if (maxIspaKey === "windSpeedKmh") {
        primaryFactor = "Stagnasi Ventilasi Atmosferik Lapisan Permukaan";
      } else if (maxIspaKey === "temperatureMin") {
        primaryFactor = "Paparan Suhu Dingin Ekstrim Malam Hari";
      } else {
        primaryFactor = "Konsentrasi Emisi Gas Buang Urban Tinggi (CO & NO2)";
      }
      recommendation = "Pemberlakuan peringatan kualitas udara dan pembagian masker medis respiratorik.";
    }
  } else if (compositeScore <= 65) { // Waspada / Moderat (Beban Risiko 35 - 64)
    if (finalDengueRisk >= finalIspaRisk) {
      if (maxDengueKey === "lagRainfallDlnm") {
        primaryFactor = "Residu Genangan Air Pasca-Hujan Ringan";
      } else if (maxDengueKey === "relativeHumidityPct") {
        primaryFactor = "Kelembapan Mikro Mendukung Vektor";
      } else {
        primaryFactor = "Kapasitas Termal Replikasi Vektor Aedes";
      }
      recommendation = "Pemeriksaan Jentik Berkala (PJB) oleh kader Jumantik kelurahan.";
    } else {
      if (maxIspaKey === "pm25") {
        primaryFactor = "Akumulasi Polutan Partikulat Ringan";
      } else if (maxIspaKey === "temperatureMin") {
        primaryFactor = "Fluktuasi Suhu Udara Rendah";
      } else {
        primaryFactor = "Ventilasi Udara Permukaan Rendah";
      }
      recommendation = "Peningkatan ventilasi udara dalam ruangan dan pengurangan emisi lokal.";
    }
  }

  return {
    dengueRisk: finalDengueRisk,
    ispaRisk: finalIspaRisk,
    compositeScore,
    primaryFactor,
    recommendation,
  };
}
