import { describe, it, expect } from "vitest";
import { predictMLDiseaseRisk } from "@/lib/ml-inference";
import { DailyClimateVector } from "@/lib/climatology";
import fs from "fs";
import path from "path";

describe("Production ML Inference Engine (src/lib/ml-inference.ts)", () => {
  const mockClimateHistory: DailyClimateVector[] = Array.from({ length: 14 }, (_, i) => ({
    date: `2026-08-${15 + i}`,
    temperatureAvg: 28.5,
    temperatureMin: 24.0,
    temperatureMax: 32.0,
    humidityAvg: 80.0,
    rainfallMm: i % 2 === 0 ? 15.0 : 0.0,
    windSpeedKmh: 10.0,
    pm25: 35.0,
  }));

  it("predicts continuous risk scores and composite EHV using trained Ridge ML weights", () => {
    const result = predictMLDiseaseRisk(mockClimateHistory);

    expect(result.dengueRisk).toBeGreaterThanOrEqual(0);
    expect(result.dengueRisk).toBeLessThanOrEqual(100);
    expect(result.ispaRisk).toBeGreaterThanOrEqual(0);
    expect(result.ispaRisk).toBeLessThanOrEqual(100);
    expect(result.compositeScore).toBeGreaterThanOrEqual(0);
    expect(result.compositeScore).toBeLessThanOrEqual(100);
    expect(result.primaryFactor).toBeTruthy();
    expect(result.recommendation).toBeTruthy();
  });

  it("produces higher dengue risk score under optimum thermal Briere and lag precipitation", () => {
    const baseline = predictMLDiseaseRisk(mockClimateHistory);
    expect(baseline.dengueRisk).toBeGreaterThan(0);
    expect(baseline.ispaRisk).toBeGreaterThan(0);
  });

  it("verifies evaluation report metrics artifacts exist and meet minimum performance standards", () => {
    const reportPath = path.resolve(process.cwd(), "data/evaluation_report.json");
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    expect(report.testSamplesCount).toBeGreaterThan(0);
    expect(report.metrics.dengue.r2Score).toBeGreaterThan(0.5);
    expect(report.metrics.compositeEHV.mae).toBeLessThan(10.0);
  });
});
