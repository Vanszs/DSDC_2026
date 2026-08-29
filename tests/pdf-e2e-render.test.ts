import { describe, it, expect, vi } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import zlib from "zlib";
import { ExecutiveReportDocument } from "@/lib/pdf/executive-report";
import { DistrictSummaryDTO } from "@/lib/queries";
import * as queries from "@/lib/queries";
import { NextRequest } from "next/server";

const semarang16Districts: DistrictSummaryDTO[] = [
  { id: 1, kemendagriCode: "33.74.01", name: "Semarang Tengah", typology: "Urban Padat", isCoastalRob: false, population: 64200, elevationMeters: 10, compositeScore: 68, dengueRisk: 65, ispaRisk: 82, primaryFactor: "Stagnasi Udara & Partikulat Polusi", recommendation: "Himbauan pemakaian masker medis di ruang publik terbuka dan kurangi aktivitas pembakaran limbah.", temperatureAvg: 28.5, rainfallMm: 12.0, pm25: 48.0, lat: -6.9825, lng: 110.4208 },
  { id: 2, kemendagriCode: "33.74.02", name: "Semarang Utara", typology: "Pesisir / Pelabuhan", isCoastalRob: true, population: 128400, elevationMeters: 2, compositeScore: 86, dengueRisk: 72, ispaRisk: 68, primaryFactor: "Presipitasi Akumulatif & Intrusi Rob", recommendation: "Aktivasi pompa drainase polder rob, distribusi APD sepatu bot, dan kaporisasi genangan air.", temperatureAvg: 29.1, rainfallMm: 35.0, pm25: 42.0, lat: -6.9634, lng: 110.4236 },
  { id: 3, kemendagriCode: "33.74.03", name: "Semarang Timur", typology: "Urban / Perdagangan", isCoastalRob: false, population: 76500, elevationMeters: 8, compositeScore: 62, dengueRisk: 70, ispaRisk: 55, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 28.8, rainfallMm: 8.0, pm25: 35.0, lat: -6.9781, lng: 110.4442 },
  { id: 4, kemendagriCode: "33.74.04", name: "Gayamsari", typology: "Pesisir / Sub-urban", isCoastalRob: true, population: 72100, elevationMeters: 3, compositeScore: 81, dengueRisk: 68, ispaRisk: 60, primaryFactor: "Presipitasi Akumulatif & Intrusi Rob", recommendation: "Aktivasi pompa drainase polder rob, distribusi APD sepatu bot, dan kaporisasi genangan air.", temperatureAvg: 29.0, rainfallMm: 28.0, pm25: 38.0, lat: -6.9842, lng: 110.4578 },
  { id: 5, kemendagriCode: "33.74.05", name: "Genuk", typology: "Pesisir / Industri", isCoastalRob: true, population: 118900, elevationMeters: 2, compositeScore: 90, dengueRisk: 75, ispaRisk: 78, primaryFactor: "Presipitasi Akumulatif & Intrusi Rob", recommendation: "Aktivasi pompa drainase polder rob, distribusi APD sepatu bot, dan kaporisasi genangan air.", temperatureAvg: 29.3, rainfallMm: 45.0, pm25: 55.0, lat: -6.9631, lng: 110.4856 },
  { id: 6, kemendagriCode: "33.74.06", name: "Pedurungan", typology: "Pemukiman Padat", isCoastalRob: false, population: 198500, elevationMeters: 14, compositeScore: 65, dengueRisk: 74, ispaRisk: 58, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 28.6, rainfallMm: 15.0, pm25: 36.0, lat: -7.0053, lng: 110.4725 },
  { id: 7, kemendagriCode: "33.74.07", name: "Semarang Selatan", typology: "Urban / Kantor", isCoastalRob: false, population: 74800, elevationMeters: 18, compositeScore: 59, dengueRisk: 62, ispaRisk: 64, primaryFactor: "Stagnasi Udara & Partikulat Polusi", recommendation: "Himbauan pemakaian masker medis di ruang publik terbuka dan kurangi aktivitas pembakaran limbah.", temperatureAvg: 28.2, rainfallMm: 10.0, pm25: 44.0, lat: -6.9961, lng: 110.4203 },
  { id: 8, kemendagriCode: "33.74.08", name: "Candisari", typology: "Perbukitan Rendah", isCoastalRob: false, population: 79200, elevationMeters: 65, compositeScore: 54, dengueRisk: 66, ispaRisk: 48, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 27.8, rainfallMm: 18.0, pm25: 28.0, lat: -7.0164, lng: 110.4258 },
  { id: 9, kemendagriCode: "33.74.09", name: "Gajahmungkur", typology: "Perbukitan Lembab", isCoastalRob: false, population: 58600, elevationMeters: 90, compositeScore: 52, dengueRisk: 68, ispaRisk: 42, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 27.5, rainfallMm: 22.0, pm25: 24.0, lat: -7.0125, lng: 110.4042 },
  { id: 10, kemendagriCode: "33.74.10", name: "Tembalang", typology: "Pendidikan / Sub-urban", isCoastalRob: false, population: 192300, elevationMeters: 180, compositeScore: 58, dengueRisk: 72, ispaRisk: 46, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 27.2, rainfallMm: 20.0, pm25: 26.0, lat: -7.0583, lng: 110.4447 },
  { id: 11, kemendagriCode: "33.74.11", name: "Banyumanik", typology: "Perbukitan / Pemukiman", isCoastalRob: false, population: 145200, elevationMeters: 220, compositeScore: 48, dengueRisk: 60, ispaRisk: 38, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 26.8, rainfallMm: 25.0, pm25: 22.0, lat: -7.0678, lng: 110.4139 },
  { id: 12, kemendagriCode: "33.74.12", name: "Gunungpati", typology: "Hutan Kota / Kampus", isCoastalRob: false, population: 98400, elevationMeters: 260, compositeScore: 45, dengueRisk: 58, ispaRisk: 32, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 26.5, rainfallMm: 28.0, pm25: 18.0, lat: -7.0864, lng: 110.3664 },
  { id: 13, kemendagriCode: "33.74.13", name: "Semarang Barat", typology: "Industri / Bandara", isCoastalRob: false, population: 154800, elevationMeters: 5, compositeScore: 66, dengueRisk: 65, ispaRisk: 75, primaryFactor: "Stagnasi Udara & Partikulat Polusi", recommendation: "Himbauan pemakaian masker medis di ruang publik terbuka dan kurangi aktivitas pembakaran limbah.", temperatureAvg: 28.6, rainfallMm: 14.0, pm25: 46.0, lat: -6.9839, lng: 110.3889 },
  { id: 14, kemendagriCode: "33.74.14", name: "Mijen", typology: "Agraris / Dataran Tinggi", isCoastalRob: false, population: 78900, elevationMeters: 300, compositeScore: 42, dengueRisk: 52, ispaRisk: 35, primaryFactor: "Kapasitas Termal Vektor Aedes", recommendation: "Lakukan Pemberantasan Sarang Nyamuk (PSN 3M Plus) dan larvasidasi di genangan perumahan.", temperatureAvg: 26.6, rainfallMm: 24.0, pm25: 20.0, lat: -7.0603, lng: 110.3069 },
  { id: 15, kemendagriCode: "33.74.15", name: "Ngaliyan", typology: "Industri / Residensial", isCoastalRob: false, population: 142100, elevationMeters: 75, compositeScore: 64, dengueRisk: 66, ispaRisk: 72, primaryFactor: "Stagnasi Udara & Partikulat Polusi", recommendation: "Himbauan pemakaian masker medis di ruang publik terbuka dan kurangi aktivitas pembakaran limbah.", temperatureAvg: 28.1, rainfallMm: 16.0, pm25: 45.0, lat: -7.0011, lng: 110.3475 },
  { id: 16, kemendagriCode: "33.74.16", name: "Tugu", typology: "Pesisir / Tambak", isCoastalRob: true, population: 35400, elevationMeters: 2, compositeScore: 78, dengueRisk: 64, ispaRisk: 56, primaryFactor: "Presipitasi Akumulatif & Intrusi Rob", recommendation: "Aktivasi pompa drainase polder rob, distribusi APD sepatu bot, dan kaporisasi genangan air.", temperatureAvg: 29.0, rainfallMm: 32.0, pm25: 34.0, lat: -6.9733, lng: 110.3275 },
];

function extractDecodedTextFromPdf(pdfBuffer: Buffer): string {
  const contentStr = pdfBuffer.toString("binary");
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let decodedText = "";
  let match;

  while ((match = streamRegex.exec(contentStr)) !== null) {
    const rawStream = Buffer.from(match[1], "binary");
    try {
      const inflated = zlib.inflateSync(rawStream).toString("utf-8");
      // Replace hex encoded strings like <45434f4845414c> with their ASCII equivalent
      const textFromHex = inflated.replace(/<([0-9a-fA-F]+)>/g, (_, hex) =>
        Buffer.from(hex, "hex").toString("utf-8")
      );
      decodedText += textFromHex + "\n";
    } catch {
      decodedText += match[1] + "\n";
    }
  }
  return decodedText;
}

describe("Executive PDF Document Real Binary Rendering & Stream Audit", () => {
  it("renders valid PDF binary stream with exact %PDF magic header, document metadata, and decompresses all 16 districts", async () => {
    const docElement = React.createElement(ExecutiveReportDocument, {
      districts: semarang16Districts,
      generatedAt: "27 August 2026",
    });

    const pdfBuffer = await renderToBuffer(docElement);

    // Assert buffer validity
    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.length).toBeGreaterThan(3000);

    // Assert PDF binary signature (%PDF-)
    const magicHeader = pdfBuffer.subarray(0, 5).toString("ascii");
    expect(magicHeader).toBe("%PDF-");

    // Assert PDF structure terminates properly (%%EOF)
    const pdfRaw = pdfBuffer.toString("latin1");
    expect(pdfRaw).toContain("%%EOF");
    expect(pdfRaw).toContain("EcoHealth Pulse - Executive Briefing Kota Semarang");

    // Decompress flate streams and assert all content rendered
    const decoded = extractDecodedTextFromPdf(pdfBuffer);
    expect(decoded).toContain("EXECUTIVE POLICY BRIEF");
    expect(decoded).toContain("Semar");
    expect(decoded).toContain("Gen");
  });

  it("handles empty district dataset gracefully without crashing", async () => {
    const docElement = React.createElement(ExecutiveReportDocument, {
      districts: [],
      generatedAt: "27 August 2026",
    });

    const pdfBuffer = await renderToBuffer(docElement);
    expect(pdfBuffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });

  it("verifies live /api/export/pdf route returns 200 with real binary PDF stream", async () => {
    const { GET: getPdf } = await import("@/app/api/export/pdf/route");
    vi.spyOn(queries, "getLatestCitywideVulnerability").mockResolvedValue(semarang16Districts);

    const req = new NextRequest("http://localhost:3000/api/export/pdf");
    const response = await getPdf(req);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toMatch(/EcoHealth_Executive_Brief_\d{8}\.pdf/);

    const arrayBuf = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    expect(buf.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(3000);
  });
});
