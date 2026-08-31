import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../src/app/api/analytics/route";
import { NextRequest } from "next/server";
import { db } from "../src/db";

describe("Analytics API Route (/api/analytics)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("harus mengembalikan response 200 dengan format JSON valid saat tanggal tidak disediakan (default today)", async () => {
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
        ispaRisk: 80,
        primaryFactor: "Presipitasi Akumulatif & Intrusi Rob",
        recommendation: "Aktivasi pompa polder rob",
        temperatureAvg: 29.2,
        rainfallMm: 45.0,
        pm25: 55.0,
      },
      {
        id: 2,
        kemendagriCode: "33.74.02",
        name: "Semarang Utara",
        typology: "Pesisir / Pelabuhan",
        isCoastalRob: true,
        population: 128400,
        centroid: { lat: -6.9634, lng: 110.4236 },
        compositeScore: 82,
        dengueRisk: 70,
        ispaRisk: 75,
        primaryFactor: "Intrusi Air Laut & Sanitasi",
        recommendation: "Pembersihan drainase tersier",
        temperatureAvg: 29.0,
        rainfallMm: 30.0,
        pm25: 48.0,
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

    const req = new NextRequest("http://localhost:3000/api/analytics");
    const start = performance.now();
    const res = await GET(req);
    const latency = performance.now() - start;

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("public, s-maxage=60, stale-while-revalidate=30");
    expect(latency).toBeLessThan(1000); // Low latency verified

    const json = await res.json();
    expect(json.status).toBe("success");
    expect(json.totalDistricts).toBe(2);
    expect(typeof json.date).toBe("string");
    expect(json.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(json.data).toHaveLength(2);

    const first = json.data[0];
    expect(first).toMatchObject({
      id: 1,
      kemendagriCode: "33.74.05",
      name: "Genuk",
      typology: "Pesisir / Industri",
      isCoastalRob: true,
      population: 118900,
      elevationMeters: 10,
      compositeScore: 88,
      dengueRisk: 75,
      ispaRisk: 80,
      primaryFactor: "Presipitasi Akumulatif & Intrusi Rob",
      recommendation: "Aktivasi pompa polder rob",
      temperatureAvg: 29.2,
      rainfallMm: 45.0,
      pm25: 55.0,
      lat: -6.9631,
      lng: 110.4856,
    });
  });

  it("harus memproses filter parameter date secara tepat", async () => {
    const mockDbDistricts = [
      {
        id: 1,
        kemendagriCode: "33.74.05",
        name: "Genuk",
        typology: "Pesisir / Industri",
        isCoastalRob: true,
        population: 118900,
        centroid: { lat: -6.9631, lng: 110.4856 },
        compositeScore: 85,
        dengueRisk: 70,
        ispaRisk: 75,
        primaryFactor: "Presipitasi Akumulatif",
        recommendation: "Aktivasi pompa polder",
        temperatureAvg: 28.5,
        rainfallMm: 40.0,
        pm25: 50.0,
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

    const req = new NextRequest("http://localhost:3000/api/analytics?date=2026-08-20");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("success");
    expect(json.date).toBe("2026-08-20");
    expect(json.totalDistricts).toBe(1);
    expect(json.data[0].name).toBe("Genuk");
  });

  it("harus mengembalikan status 400 Bad Request jika format parameter date tidak valid", async () => {
    const req = new NextRequest("http://localhost:3000/api/analytics?date=invalid-date-format");
    const res = await GET(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Bad Request");
    expect(json.details).toBeDefined();
    expect(json.details[0].message).toContain("Invalid date format, expected YYYY-MM-DD");
  });

  it("harus mengembalikan status 500 Internal Server Error saat database mengalami kendala", async () => {
    vi.spyOn(db, "select").mockImplementation(() => {
      throw new Error("Database connection lost");
    });

    const req = new NextRequest("http://localhost:3000/api/analytics");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Internal Server Error");
    expect(json.message).toBe("Database connection lost");
  });

  it("harus mengembalikan nilai default fallback yang aman jika relasi data cuaca / risiko bernilai null", async () => {
    const mockDbDistrictsNulls = [
      {
        id: 3,
        kemendagriCode: "33.74.01",
        name: "Semarang Tengah",
        typology: "Urban Padat",
        isCoastalRob: false,
        population: 64200,
        centroid: { lat: -6.9825, lng: 110.4208 },
        compositeScore: null,
        dengueRisk: null,
        ispaRisk: null,
        primaryFactor: null,
        recommendation: null,
        temperatureAvg: null,
        rainfallMm: null,
        pm25: null,
      },
    ];

    vi.spyOn(db, "select").mockImplementation(() => ({
      from: () => ({
        leftJoin: () => ({
          leftJoin: () => ({
            orderBy: () => Promise.resolve(mockDbDistrictsNulls),
          }),
        }),
      }),
    } as any));

    const req = new NextRequest("http://localhost:3000/api/analytics?date=2026-08-25");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    const item = json.data[0];
    expect(item.compositeScore).toBe(0);
    expect(item.dengueRisk).toBe(0);
    expect(item.ispaRisk).toBe(0);
    expect(item.primaryFactor).toBe("Normal");
    expect(item.recommendation).toBe("Monitoring standar");
    expect(item.temperatureAvg).toBe(28.3);
    expect(item.rainfallMm).toBe(0.0);
    expect(item.pm25).toBe(34.5);
    expect(item.lat).toBe(-6.9825);
    expect(item.lng).toBe(110.4208);
  });

  it("harus memvalidasi performa latensi dan struktur payload lengkap 16 kecamatan Semarang", async () => {
    const mock16Districts = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      kemendagriCode: `33.74.${String(i + 1).padStart(2, "0")}`,
      name: `Kecamatan ${i + 1}`,
      typology: i % 2 === 0 ? "Pesisir" : "Urban Padat",
      isCoastalRob: i % 3 === 0,
      population: 50000 + i * 5000,
      centroid: { lat: -7.0 + i * 0.01, lng: 110.4 + i * 0.01 },
      compositeScore: 50 + (i % 50),
      dengueRisk: 40 + (i % 40),
      ispaRisk: 45 + (i % 35),
      primaryFactor: "Faktor Uji",
      recommendation: "Rekomendasi Uji",
      temperatureAvg: 28.5,
      rainfallMm: 12.0,
      pm25: 35.0,
    }));

    vi.spyOn(db, "select").mockImplementation(() => ({
      from: () => ({
        leftJoin: () => ({
          leftJoin: () => ({
            orderBy: () => Promise.resolve(mock16Districts),
          }),
        }),
      }),
    } as any));

    const iterations = 50;
    const latencies: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const req = new NextRequest("http://localhost:3000/api/analytics?date=2026-08-27");
      const start = performance.now();
      const res = await GET(req);
      const latency = performance.now() - start;
      latencies.push(latency);

      expect(res.status).toBe(200);
    }

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const maxLatency = Math.max(...latencies);

    // Latency should be sub-millisecond to low milliseconds in mocked in-memory execution (< 50ms)
    expect(avgLatency).toBeLessThan(50);
    expect(maxLatency).toBeLessThan(100);

    const req = new NextRequest("http://localhost:3000/api/analytics?date=2026-08-27");
    const res = await GET(req);
    const json = await res.json();

    expect(json.status).toBe("success");
    expect(json.totalDistricts).toBe(16);
    expect(json.data).toHaveLength(16);

    // Verify all 16 items have all required properties
    for (const item of json.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("kemendagriCode");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("typology");
      expect(item).toHaveProperty("isCoastalRob");
      expect(item).toHaveProperty("population");
      expect(item).toHaveProperty("compositeScore");
      expect(item).toHaveProperty("dengueRisk");
      expect(item).toHaveProperty("ispaRisk");
      expect(item).toHaveProperty("primaryFactor");
      expect(item).toHaveProperty("recommendation");
      expect(item).toHaveProperty("temperatureAvg");
      expect(item).toHaveProperty("rainfallMm");
      expect(item).toHaveProperty("pm25");
      expect(item).toHaveProperty("lat");
      expect(item).toHaveProperty("lng");
    }
  });
});
