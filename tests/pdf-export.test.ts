import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import * as queries from "@/lib/queries";

vi.mock("@react-pdf/renderer", () => {
  return {
    renderToBuffer: vi.fn().mockResolvedValue(Buffer.from("%PDF-1.4 Mock PDF Content")),
    Document: ({ children }: any) => children,
    Page: ({ children }: any) => children,
    Text: ({ children }: any) => children,
    View: ({ children }: any) => children,
    StyleSheet: {
      create: (s: any) => s,
    },
  };
});

describe("PDF Export API Route (/api/export/pdf)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a PDF buffer with correct headers", async () => {
    const { GET: getPdf } = await import("@/lib/../app/api/export/pdf/route");
    vi.spyOn(queries, "getLatestCitywideVulnerability").mockResolvedValue([
      {
        id: 1,
        kemendagriCode: "33.74.01",
        name: "Semarang Tengah",
        typology: "Urban Dense",
        isCoastalRob: false,
        population: 65000,
        elevationMeters: 10,
        lat: -6.9825,
        lng: 110.4208,
        temperatureAvg: 28.5,
        rainfallMm: 12.0,
        pm25: 35.0,
        compositeScore: 78,
        dengueRisk: 82,
        ispaRisk: 60,
        primaryFactor: "Kepadatan Tinggi",
        recommendation: "PSN 3M Plus Masif",
      },
    ]);

    const req = new NextRequest("http://localhost:3000/api/export/pdf");
    const response = await getPdf(req);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("EcoHealth_Executive_Brief_");
    
    const arrayBuf = await response.arrayBuffer();
    expect(Buffer.from(arrayBuf).toString()).toContain("%PDF-1.4 Mock PDF Content");
  });

  it("should return status 500 when PDF generation throws an error", async () => {
    const { GET: getPdf } = await import("@/lib/../app/api/export/pdf/route");
    vi.spyOn(queries, "getLatestCitywideVulnerability").mockRejectedValue(
      new Error("PDF Query Failed")
    );

    const req = new NextRequest("http://localhost:3000/api/export/pdf");
    const response = await getPdf(req);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toContain("Internal Server Error generating PDF");
  });
});
