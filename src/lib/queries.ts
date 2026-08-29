import "server-only";
import { db } from "../db";
import { districts, epidemiologicalRiskScores, weatherObservations } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { format } from "date-fns";

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

export async function getLatestCitywideVulnerability(dateParam?: string): Promise<DistrictSummaryDTO[]> {
  const targetDate = dateParam || format(new Date(), "yyyy-MM-dd");

  const rows = await db
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

  return rows.map((r) => ({
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
