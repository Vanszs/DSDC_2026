import { describe, it, expect } from "vitest";
import {
  computeBriereSuitability,
  computeLagRainfallEffect,
  computeAntecedentRainfallIndex5,
  evaluateDistrictRisk,
  DailyClimateVector,
} from "../src/lib/climatology";

describe("Climatology Mathematical Formulations", () => {
  describe("computeBriereSuitability (Thermal Suitability)", () => {
    it("harus bernilai 0.0 jika suhu di bawah batas minimal (<= 16°C)", () => {
      expect(computeBriereSuitability(15.0)).toBe(0.0);
      expect(computeBriereSuitability(16.0)).toBe(0.0);
    });

    it("harus bernilai 0.0 jika suhu di atas batas maksimal (>= 36°C)", () => {
      expect(computeBriereSuitability(36.0)).toBe(0.0);
      expect(computeBriereSuitability(37.5)).toBe(0.0);
    });

    it("harus mendekati nilai maksimal 1.0 pada suhu optimum (sekitar 28.5°C)", () => {
      const suitability = computeBriereSuitability(28.5);
      expect(suitability).toBeGreaterThan(0.9);
      expect(suitability).toBeLessThanOrEqual(1.0);
    });
  });

  describe("computeLagRainfallEffect (DLNM 14-Day Gaussian Lag)", () => {
    it("harus menghasilkan bobot tertinggi jika hujan lebat terjadi di lag ~8 hari", () => {
      const rainSpikeDay8: number[] = Array(14).fill(0);
      rainSpikeDay8[6] = 50; // Lag 8 hari (indeks 6)

      const rainSpikeDay1: number[] = Array(14).fill(0);
      rainSpikeDay1[0] = 50; // Lag 14 hari (indeks 0)

      const scoreSpikeDay8 = computeLagRainfallEffect(rainSpikeDay8);
      const scoreSpikeDay1 = computeLagRainfallEffect(rainSpikeDay1);

      expect(scoreSpikeDay8).toBeGreaterThan(scoreSpikeDay1);
    });

    it("harus mengembalikan nilai 0.0 jika tidak ada hujan dalam 14 hari", () => {
      const zeroRain = Array(14).fill(0);
      expect(computeLagRainfallEffect(zeroRain)).toBe(0.0);
    });
  });

  describe("computeAntecedentRainfallIndex5 (API-5 Leptospirosis)", () => {
    it("harus menghitung peluruhan geometris 0.8^i secara presisi", () => {
      const rainfall5Days = [10, 10, 10, 10, 10];
      // API5 = 10*(1 + 0.8 + 0.64 + 0.512 + 0.4096) = 10 * 3.3616 = 33.616
      const api = computeAntecedentRainfallIndex5(rainfall5Days);
      expect(api).toBeCloseTo(33.616, 2);
    });
  });

  describe("evaluateDistrictRisk (Composite Multi-Disease Model)", () => {
    const mockClimate14Days: DailyClimateVector[] = Array.from({ length: 14 }, (_, i) => ({
      date: `2026-08-${14 - i}`,
      temperatureAvg: 28.5,
      temperatureMin: 25.0,
      temperatureMax: 32.5,
      humidityAvg: 85.0,
      rainfallMm: 25.0,
      windSpeedKmh: 5.0,
      pm25: 45.0,
    }));

    it("skor EHV harus berada dalam rentang valid 0 - 100", () => {
      const result = evaluateDistrictRisk(mockClimate14Days, true, 0.6);
      expect(result.compositeScore).toBeGreaterThanOrEqual(0);
      expect(result.compositeScore).toBeLessThanOrEqual(100);
      expect(result.dengueRisk).toBeGreaterThanOrEqual(0);
      expect(result.dengueRisk).toBeLessThanOrEqual(100);
      expect(result.ispaRisk).toBeGreaterThanOrEqual(0);
      expect(result.ispaRisk).toBeLessThanOrEqual(100);
    });

    it("harus mengembalikan nilai default aman jika dataset iklim kosong", () => {
      const emptyResult = evaluateDistrictRisk([], false, 0.8);
      expect(emptyResult.compositeScore).toBe(0);
      expect(emptyResult.primaryFactor).toBe("Insufficient Data");
    });
  });
});
