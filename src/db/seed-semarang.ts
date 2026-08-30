import { db, client } from "./index";
import { districts, weatherObservations, epidemiologicalRiskScores } from "./schema";
import { DailyClimateVector } from "../lib/climatology";
import { SEMARANG_PRIMARY_ERA5_GRID } from "../lib/downscaling";
import { fetchOpenMeteoECMWFData, OpenMeteoDailyRecord } from "../lib/openmeteo";
import { predictMLDiseaseRisk } from "../lib/ml-inference";
import { subDays, addDays, format } from "date-fns";

interface SemarangSeedItem {
  code: string;
  name: string;
  typology: string;
  isCoastalRob: boolean;
  population: number;
  areaKm2: number;
  elevation: number;
  sanitation: number;
  lat: number;
  lng: number;
}

export const SEMARANG_16_DISTRICTS: SemarangSeedItem[] = [
  { code: "33.74.01", name: "Semarang Tengah", typology: "Urban Padat", isCoastalRob: false, population: 64200, areaKm2: 6.14, elevation: 12, sanitation: 0.85, lat: -6.9825, lng: 110.4208 },
  { code: "33.74.02", name: "Semarang Utara", typology: "Pesisir / Pelabuhan", isCoastalRob: true, population: 128400, areaKm2: 10.97, elevation: 2, sanitation: 0.60, lat: -6.9634, lng: 110.4236 },
  { code: "33.74.03", name: "Semarang Timur", typology: "Urban / Perdagangan", isCoastalRob: false, population: 76500, areaKm2: 7.70, elevation: 8, sanitation: 0.78, lat: -6.9781, lng: 110.4442 },
  { code: "33.74.04", name: "Gayamsari", typology: "Pesisir / Sub-urban", isCoastalRob: true, population: 72100, areaKm2: 6.18, elevation: 3, sanitation: 0.65, lat: -6.9842, lng: 110.4578 },
  { code: "33.74.05", name: "Genuk", typology: "Pesisir / Industri", isCoastalRob: true, population: 118900, areaKm2: 27.39, elevation: 2, sanitation: 0.58, lat: -6.9631, lng: 110.4856 },
  { code: "33.74.06", name: "Pedurungan", typology: "Pemukiman Padat", isCoastalRob: false, population: 198500, areaKm2: 20.72, elevation: 10, sanitation: 0.80, lat: -7.0053, lng: 110.4725 },
  { code: "33.74.07", name: "Semarang Selatan", typology: "Urban / Kantor", isCoastalRob: false, population: 74800, areaKm2: 14.83, elevation: 18, sanitation: 0.88, lat: -6.9961, lng: 110.4203 },
  { code: "33.74.08", name: "Candisari", typology: "Perbukitan Rendah", isCoastalRob: false, population: 79200, areaKm2: 6.54, elevation: 45, sanitation: 0.82, lat: -7.0164, lng: 110.4258 },
  { code: "33.74.09", name: "Gajahmungkur", typology: "Perbukitan Lembab", isCoastalRob: false, population: 58600, areaKm2: 9.07, elevation: 75, sanitation: 0.86, lat: -7.0125, lng: 110.4042 },
  { code: "33.74.10", name: "Tembalang", typology: "Pendidikan / Sub-urban", isCoastalRob: false, population: 192300, areaKm2: 44.20, elevation: 120, sanitation: 0.84, lat: -7.0583, lng: 110.4447 },
  { code: "33.74.11", name: "Banyumanik", typology: "Perbukitan / Pemukiman", isCoastalRob: false, population: 145200, areaKm2: 25.69, elevation: 180, sanitation: 0.89, lat: -7.0678, lng: 110.4139 },
  { code: "33.74.12", name: "Gunungpati", typology: "Hutan Kota / Kampus", isCoastalRob: false, population: 98400, areaKm2: 54.11, elevation: 220, sanitation: 0.85, lat: -7.0864, lng: 110.3664 },
  { code: "33.74.13", name: "Semarang Barat", typology: "Industri / Bandara", isCoastalRob: false, population: 154800, areaKm2: 21.74, elevation: 6, sanitation: 0.79, lat: -6.9839, lng: 110.3889 },
  { code: "33.74.14", name: "Mijen", typology: "Agraris / Dataran Tinggi", isCoastalRob: false, population: 78900, areaKm2: 57.55, elevation: 210, sanitation: 0.81, lat: -7.0603, lng: 110.3069 },
  { code: "33.74.15", name: "Ngaliyan", typology: "Industri / Residensial", isCoastalRob: false, population: 142100, areaKm2: 37.99, elevation: 40, sanitation: 0.80, lat: -7.0011, lng: 110.3475 },
  { code: "33.74.16", name: "Tugu", typology: "Pesisir / Tambak", isCoastalRob: true, population: 35400, areaKm2: 31.78, elevation: 3, sanitation: 0.62, lat: -6.9733, lng: 110.3275 },
];

async function runSeed() {
  console.log("Menjalankan Seeding Database EcoHealth Pulse (Semarang 16 Kecamatan dengan Live Open-Meteo ECMWF & Topo Downscaling)...");

  // 1. Ambil data aktual ECMWF dari Open-Meteo API (Historical 35 hari + Forecast 30 hari penuh)
  const openMeteoData: OpenMeteoDailyRecord[] = await fetchOpenMeteoECMWFData(-7.0000, 110.4000, 35, 30);
  const openMeteoMap = new Map<string, OpenMeteoDailyRecord>();
  openMeteoData.forEach((rec) => openMeteoMap.set(rec.date, rec));

  await db.delete(epidemiologicalRiskScores);
  await db.delete(weatherObservations);

  const allWeatherRows: any[] = [];
  const allScoreRows: any[] = [];

  for (const d of SEMARANG_16_DISTRICTS) {
    const [insertedDistrict] = await db
      .insert(districts)
      .values({
        kemendagriCode: d.code,
        name: d.name,
        typology: d.typology,
        isCoastalRobRisk: d.isCoastalRob,
        population: d.population,
        areaKm2: d.areaKm2,
        elevationMeters: d.elevation,
        sanitationIndex: d.sanitation,
        centroid: { lat: d.lat, lng: d.lng },
      })
      .onConflictDoUpdate({
        target: districts.kemendagriCode,
        set: {
          name: d.name,
          typology: d.typology,
          isCoastalRobRisk: d.isCoastalRob,
          population: d.population,
          areaKm2: d.areaKm2,
          elevationMeters: d.elevation,
          sanitationIndex: d.sanitation,
          centroid: { lat: d.lat, lng: d.lng },
        },
      })
      .returning();

    const districtId = insertedDistrict.id;
    const now = new Date();
    const climateSeries: DailyClimateVector[] = [];

    // 1. Generate Historical Observations & Future Projections dari data Open-Meteo + Downscaling DEMNAS
    for (let dayOffset = -35; dayOffset <= 30; dayOffset++) {
      const obsDate = dayOffset < 0 ? subDays(now, Math.abs(dayOffset)) : addDays(now, dayOffset);
      const dateStr = format(obsDate, "yyyy-MM-dd");

      const omRecord = openMeteoMap.get(dateStr);
      const baseTemp = omRecord?.temperatureAvg ?? SEMARANG_PRIMARY_ERA5_GRID.temperatureC;
      const baseRain = omRecord?.rainfallMm ?? SEMARANG_PRIMARY_ERA5_GRID.totalPrecipitationMm;
      const baseHumid = omRecord?.humidityAvg ?? SEMARANG_PRIMARY_ERA5_GRID.relativeHumidityPct;
      const baseWind = omRecord?.windSpeedKmh ?? SEMARANG_PRIMARY_ERA5_GRID.windSpeedKmh;
      const basePm25 = omRecord?.pm25 ?? SEMARANG_PRIMARY_ERA5_GRID.pm25;

      // Downscaling ke tingkat elevasi kecamatan aktual (Lapse Rate -0.65°C / 100m)
      const lapseCorrection = -0.0065 * (d.elevation - SEMARANG_PRIMARY_ERA5_GRID.geopotentialElevationM);
      const tAvg = parseFloat((baseTemp + lapseCorrection).toFixed(1));
      const tMin = parseFloat((tAvg - 3.2).toFixed(1));
      const tMax = parseFloat((tAvg + 3.8).toFixed(1));

      // Orografi Lereng Gunung Ungaran (Presipitasi meningkat seiring elevasi)
      const orographicFactor = d.elevation > 50 ? 1 + 0.0007 * (d.elevation - 50) : 1.0;
      const rain = parseFloat((baseRain * orographicFactor).toFixed(1));

      const humidity = parseFloat(
        Math.min(98, Math.max(50, baseHumid + (d.isCoastalRob ? 4.0 : 0))).toFixed(1)
      );
      const wind = parseFloat(baseWind.toFixed(1));
      const pm25 = parseFloat(basePm25.toFixed(1));

      allWeatherRows.push({
        districtId,
        observationDate: dateStr,
        temperatureAvg: tAvg,
        temperatureMin: tMin,
        temperatureMax: tMax,
        humidityAvg: humidity,
        rainfallMm: Math.max(0, rain),
        windSpeedKmh: Math.max(1, wind),
        pm25: Math.max(5, pm25),
      });

      climateSeries.push({
        date: dateStr,
        temperatureAvg: tAvg,
        temperatureMin: tMin,
        temperatureMax: tMax,
        humidityAvg: humidity,
        rainfallMm: Math.max(0, rain),
        windSpeedKmh: Math.max(1, wind),
        pm25: Math.max(5, pm25),
      });
    }

    // 2. Evaluasi Epidemiological Risk Scores
    for (let dayOffset = -28; dayOffset <= 30; dayOffset++) {
      const targetDateObj = dayOffset < 0 ? subDays(now, Math.abs(dayOffset)) : addDays(now, dayOffset);
      const targetDate = format(targetDateObj, "yyyy-MM-dd");

      const targetIndex = climateSeries.findIndex((c) => c.date === targetDate);
      if (targetIndex >= 14) {
        const sliced14Days = climateSeries.slice(targetIndex - 13, targetIndex + 1);
        const risk = predictMLDiseaseRisk(sliced14Days, {
          population: d.population,
          areaKm2: d.areaKm2,
          sanitationIndex: d.sanitation,
          isCoastalRobRisk: d.isCoastalRob,
        });

        allScoreRows.push({
          districtId,
          scoreDate: targetDate,
          dengueRiskScore: risk.dengueRisk,
          ispaRiskScore: risk.ispaRisk,
          compositeVulnerabilityScore: risk.compositeScore,
          primaryRiskFactor: risk.primaryFactor,
          actionablePolicyRecommendation: risk.recommendation,
        });
      }
    }
  }

  // Atomic bulk batch insertions
  if (allWeatherRows.length > 0) {
    await db.insert(weatherObservations).values(allWeatherRows);
  }
  if (allScoreRows.length > 0) {
    await db.insert(epidemiologicalRiskScores).values(allScoreRows);
  }

  console.log(`✓ Seeding Sukses: 16 Kecamatan, ${allWeatherRows.length} Weather Rows, ${allScoreRows.length} Score Rows.`);
  await client.end();
}

runSeed().catch((err) => {
  console.error("Gagal melakukan seeding:", err);
  process.exit(1);
});
