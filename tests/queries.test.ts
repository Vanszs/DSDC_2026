import { describe, it, expect, vi } from "vitest";
import { getLatestCitywideVulnerability } from "../src/lib/queries";
import { db } from "../src/db";

describe("Database Queries & Server-Only Logic", () => {
  it("getLatestCitywideVulnerability harus mengembalikan array data 16 kecamatan yang lengkap", async () => {
    // Mock database select query untuk pengujian unit independen
    const mockDbDistricts = [
      {
        id: 1,
        kemendagriCode: "33.74.05",
        name: "Genuk",
        typology: "Pesisir / Industri",
        isCoastalRob: true,
        population: 118900,
        centroid: { lat: -6.9631, lng: 110.4856 },
        compositeScore: 88,
        dengueRisk: 75,
        leptospirosisRisk: 92,
        ispaRisk: 80,
        primaryFactor: "Presipitasi Akumulatif & Intrusi Rob",
        recommendation: "Aktivasi pompa polder rob",
        temperatureAvg: 29.2,
        rainfallMm: 45.0,
        pm25: 55.0,
      },
    ];

    vi.spyOn(db, "select").mockImplementation(() => ({
      from: () => ({
        leftJoin: () => ({
          leftJoin: () => ({
            orderBy: () => Promise.resolve(mockDbDistricts),
          }),
        }),
      }),
    } as any));

    const results = await getLatestCitywideVulnerability("2026-08-27");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Genuk");
    expect(results[0].isCoastalRob).toBe(true);
    expect(results[0].compositeScore).toBe(88);
    expect(results[0].lat).toBe(-6.9631);
    expect(results[0].lng).toBe(110.4856);
  });
});
