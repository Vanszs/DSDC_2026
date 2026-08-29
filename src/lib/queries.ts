import "server-only";
import { db } from "../db";
import { districts, epidemiologicalRiskScores, weatherObservations } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { format, parseISO, subDays } from "date-fns";
import { fetchOpenMeteoECMWFData, OpenMeteoDailyRecord } from "./openmeteo";
import { predictMLDiseaseRisk } from "./ml-inference";
import { downscaleERA5SingleGridToDistrict, SEMARANG_PRIMARY_ERA5_GRID, ERA5SingleGridReference } from "./downscaling";
import { DailyClimateVector } from "./climatology";

export interface DistrictSummaryDTO {
  id: number;
  kemendagriCode: string;
  name: string;
  typology: string;
  isCoastalRob: boolean;
  population: number;
  elevationMeters: number;
  compositeScore: number;
  dengueRisk: number;
  ispaRisk: number;
  primaryFactor: string;
  recommendation: string;
  temperatureAvg: number;
  rainfallMm: number;
  pm25: number;
  lat: number;
  lng: number;
}

/**
 * 3-Tier Robust Ingestion & Inference Engine:
 * 1. Query Database (Cache Hit < 5ms)
 * 2. Live Open-Meteo Fetch & Inference (Cache Miss / Realtime Freshness)
 * 3. 30-Year Climatological Baseline Fallback (Zero-Downtime Guarantee)
 */
export async function getLatestCitywideVulnerability(dateParam?: string): Promise<DistrictSummaryDTO[]> {
  const targetDate = dateParam || format(new Date(), "yyyy-MM-dd");

  try {
    // TIER 1: Cek apakah data targetDate sudah ada di DB
    const existingRows = await db
      .select({
        id: districts.id,
        kemendagriCode: districts.kemendagriCode,
        name: districts.name,
        typology: districts.typology,
        isCoastalRob: districts.isCoastalRobRisk,
        population: districts.population,
        elevationMeters: districts.elevationMeters,
        centroid: districts.centroid,
        compositeScore: epidemiologicalRiskScores.compositeVulnerabilityScore,
        dengueRisk: epidemiologicalRiskScores.dengueRiskScore,
        ispaRisk: epidemiologicalRiskScores.ispaRiskScore,
        primaryFactor: epidemiologicalRiskScores.primaryRiskFactor,
        recommendation: epidemiologicalRiskScores.actionablePolicyRecommendation,
        temperatureAvg: weatherObservations.temperatureAvg,
        rainfallMm: weatherObservations.rainfallMm,
        pm25: weatherObservations.pm25,
      })
      .from(districts)
      .leftJoin(
        epidemiologicalRiskScores,
        and(
          eq(districts.id, epidemiologicalRiskScores.districtId),
          eq(epidemiologicalRiskScores.scoreDate, targetDate)
        )
      )
      .leftJoin(
        weatherObservations,
        and(
          eq(districts.id, weatherObservations.districtId),
          eq(weatherObservations.observationDate, targetDate)
        )
      )
      .orderBy(desc(epidemiologicalRiskScores.compositeVulnerabilityScore));

    // Jika query DB berhasil mengembalikan baris, gunakan data tersebut
    if (existingRows && existingRows.length > 0) {
      return existingRows.map((r) => ({
        id: r.id,
        kemendagriCode: r.kemendagriCode,
        name: r.name,
        typology: r.typology,
        isCoastalRob: r.isCoastalRob,
        population: r.population,
        elevationMeters: r.elevationMeters ?? 10,
        compositeScore: r.compositeScore ?? 0,
        dengueRisk: r.dengueRisk ?? 0,
        ispaRisk: r.ispaRisk ?? 0,
        primaryFactor: r.primaryFactor ?? "Normal",
        recommendation: r.recommendation ?? "Monitoring standar",
        temperatureAvg: r.temperatureAvg ?? 28.3,
        rainfallMm: r.rainfallMm ?? 0.0,
        pm25: r.pm25 ?? 34.5,
        lat: r.centroid?.lat ?? -7.0000,
        lng: r.centroid?.lng ?? 110.4000,
      }));
    }

    // TIER 2: Live Fetch Open-Meteo & Real-Time Inference
    const allDistricts = (await db.select().from(districts)) || [];
    const liveWeather = await fetchOpenMeteoECMWFData(-7.0000, 110.4000, 28, 14);

    if (Array.isArray(allDistricts) && allDistricts.length > 0 && liveWeather.length >= 14) {
      const targetIdx = liveWeather.findIndex((w) => w.date === targetDate);
      const endIdx = targetIdx !== -1 ? targetIdx : liveWeather.length - 1;
      const past14 = liveWeather.slice(Math.max(0, endIdx - 13), endIdx + 1);

      const targetDayWeather = liveWeather[endIdx] ?? liveWeather[liveWeather.length - 1];

      const results: DistrictSummaryDTO[] = [];

      for (const dist of allDistricts) {
        // Downscaling Topografis DEMNAS 30m
        const era5Ref: ERA5SingleGridReference = {
          ...SEMARANG_PRIMARY_ERA5_GRID,
          temperatureC: targetDayWeather.temperatureAvg,
          totalPrecipitationMm: targetDayWeather.rainfallMm,
          relativeHumidityPct: targetDayWeather.humidityAvg,
          windSpeedKmh: targetDayWeather.windSpeedKmh,
          pm25: targetDayWeather.pm25,
        };

        const downscaled = downscaleERA5SingleGridToDistrict(
          {
            kemendagriCode: dist.kemendagriCode,
            name: dist.name,
            centroid: dist.centroid,
            elevationMeters: dist.elevationMeters,
            isCoastalRobRisk: dist.isCoastalRobRisk,
          },
          era5Ref
        );

        // Siapkan time-series 14 hari dengan koreksi mikroklimat kecamatan
        const district14Days: DailyClimateVector[] = past14.map((w) => ({
          date: w.date,
          temperatureAvg: parseFloat((w.temperatureAvg + downscaled.lapseRateCorrection).toFixed(1)),
          temperatureMin: w.temperatureMin,
          temperatureMax: w.temperatureMax,
          humidityAvg: downscaled.humidityAvg,
          rainfallMm: w.rainfallMm,
          windSpeedKmh: w.windSpeedKmh,
          pm25: downscaled.pm25,
        }));

        // Jalankan ML Inference L2 Ridge
        const prediction = predictMLDiseaseRisk(district14Days);

        results.push({
          id: dist.id,
          kemendagriCode: dist.kemendagriCode,
          name: dist.name,
          typology: dist.typology,
          isCoastalRob: dist.isCoastalRobRisk,
          population: dist.population,
          elevationMeters: dist.elevationMeters,
          compositeScore: prediction.compositeScore,
          dengueRisk: prediction.dengueRisk,
          ispaRisk: prediction.ispaRisk,
          primaryFactor: prediction.primaryFactor,
          recommendation: prediction.recommendation,
          temperatureAvg: downscaled.temperatureAvg,
          rainfallMm: downscaled.rainfallMm,
          pm25: downscaled.pm25,
          lat: dist.centroid.lat,
          lng: dist.centroid.lng,
        });

        // Simpan / Upsert ke Database secara asinkron (Cache Population)
        try {
          await db
            .insert(weatherObservations)
            .values({
              districtId: dist.id,
              observationDate: targetDate,
              temperatureAvg: downscaled.temperatureAvg,
              temperatureMin: downscaled.temperatureMin,
              temperatureMax: downscaled.temperatureMax,
              humidityAvg: downscaled.humidityAvg,
              rainfallMm: downscaled.rainfallMm,
              windSpeedKmh: downscaled.windSpeedKmh,
              pm25: downscaled.pm25,
            })
            .onConflictDoUpdate({
              target: [weatherObservations.districtId, weatherObservations.observationDate],
              set: {
                temperatureAvg: downscaled.temperatureAvg,
                rainfallMm: downscaled.rainfallMm,
                pm25: downscaled.pm25,
              },
            });

          await db
            .insert(epidemiologicalRiskScores)
            .values({
              districtId: dist.id,
              scoreDate: targetDate,
              compositeVulnerabilityScore: prediction.compositeScore,
              dengueRiskScore: prediction.dengueRisk,
              ispaRiskScore: prediction.ispaRisk,
              primaryRiskFactor: prediction.primaryFactor,
              actionablePolicyRecommendation: prediction.recommendation,
            })
            .onConflictDoUpdate({
              target: [epidemiologicalRiskScores.districtId, epidemiologicalRiskScores.scoreDate],
              set: {
                compositeVulnerabilityScore: prediction.compositeScore,
                dengueRiskScore: prediction.dengueRisk,
                ispaRiskScore: prediction.ispaRisk,
                primaryRiskFactor: prediction.primaryFactor,
                actionablePolicyRecommendation: prediction.recommendation,
              },
            });
        } catch {
          // Abaikan kendala write DB non-blocking
        }
      }

      return results.sort((a, b) => b.compositeScore - a.compositeScore);
    }
  } catch (error) {
    console.warn("DB/Live Ingestion error, advancing to Climatological Fallback:", error);
  }

  // TIER 3: Zero-Downtime Climatological Fallback (Anti-500 Error)
  const rawDistricts = (await db.select().from(districts)) || [];
  const districtList = Array.isArray(rawDistricts) ? rawDistricts : [];

  if (districtList.length === 0) {
    return [];
  }

  return districtList.map((d) => {
    const downscaled = downscaleERA5SingleGridToDistrict({
      kemendagriCode: d.kemendagriCode,
      name: d.name,
      centroid: d.centroid,
      elevationMeters: d.elevationMeters,
      isCoastalRobRisk: d.isCoastalRobRisk,
    });

    const fallback14Days: DailyClimateVector[] = Array.from({ length: 14 }, (_, i) => ({
      date: format(subDays(new Date(), 13 - i), "yyyy-MM-dd"),
      temperatureAvg: downscaled.temperatureAvg,
      temperatureMin: 23.5,
      temperatureMax: 32.0,
      humidityAvg: downscaled.humidityAvg,
      rainfallMm: downscaled.rainfallMm,
      windSpeedKmh: downscaled.windSpeedKmh,
      pm25: downscaled.pm25,
    }));

    const prediction = predictMLDiseaseRisk(fallback14Days);

    return {
      id: d.id,
      kemendagriCode: d.kemendagriCode,
      name: d.name,
      typology: d.typology,
      isCoastalRob: d.isCoastalRobRisk,
      population: d.population,
      elevationMeters: d.elevationMeters,
      compositeScore: prediction.compositeScore,
      dengueRisk: prediction.dengueRisk,
      ispaRisk: prediction.ispaRisk,
      primaryFactor: prediction.primaryFactor,
      recommendation: prediction.recommendation,
      temperatureAvg: downscaled.temperatureAvg,
      rainfallMm: downscaled.rainfallMm,
      pm25: downscaled.pm25,
      lat: d.centroid.lat,
      lng: d.centroid.lng,
    };
  }).sort((a, b) => b.compositeScore - a.compositeScore);
}
