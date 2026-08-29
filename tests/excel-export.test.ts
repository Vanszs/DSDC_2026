import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../src/app/api/export/excel/route";
import { NextRequest } from "next/server";
import { db } from "../src/db";
import ExcelJS from "exceljs";

describe("Excel Export API Route (/api/export/excel)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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
    {
      id: 2,
      kemendagriCode: "33.74.01",
      name: "Semarang Tengah",
      typology: "Urban Padat",
      isCoastalRob: false,
      population: 64200,
      centroid: { lat: -6.9825, lng: 110.4208 },
      compositeScore: 65,
      dengueRisk: 60,
      leptospirosisRisk: 40,
      ispaRisk: 70,
      primaryFactor: "Stagnasi Udara & Partikulat Polusi",
      recommendation: "Himbauan pemakaian masker",
      temperatureAvg: 28.5,
      rainfallMm: 10.0,
      pm25: 45.0,
    },
  ];

  it("harus mengembalikan response 200 dengan binary stream OpenXML Excel dan headers yang tepat", async () => {
    vi.spyOn(db, "select").mockImplementation(() => ({
      from: () => ({
        leftJoin: () => ({
          leftJoin: () => ({
            orderBy: () => Promise.resolve(mockDbDistricts),
          }),
        }),
      }),
    } as any));

    const req = new NextRequest("http://localhost:3000/api/export/excel");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.headers.get("Content-Disposition")).toMatch(
      /^attachment; filename="EcoHealth_Dataset_Semarang_\d{8}\.xlsx"$/
    );

    // Verifikasi binary buffer dan workbook
    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(0);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    expect(workbook.creator).toBe("EcoHealth Pulse Platform");
    const worksheet = workbook.getWorksheet("Kerentanan Semarang");
    expect(worksheet).toBeDefined();

    // Verifikasi baris header (Row 1)
    const headerRow = worksheet!.getRow(1);
    expect(headerRow.getCell(1).value).toBe("Kode Kemendagri");
    expect(headerRow.getCell(2).value).toBe("Nama Kecamatan");
    expect(headerRow.getCell(3).value).toBe("Tipologi");
    expect(headerRow.getCell(4).value).toBe("Rawan Rob");
    expect(headerRow.getCell(5).value).toBe("Populasi");
    expect(headerRow.getCell(6).value).toBe("Skor Bahaya (0-100)");
    expect(headerRow.getCell(7).value).toBe("DBD Risk (%)");
    expect(headerRow.getCell(8).value).toBe("ISPA Risk (%)");
    expect(headerRow.getCell(9).value).toBe("Faktor Pemicu Utama");
    expect(headerRow.getCell(10).value).toBe("Rekomendasi Kebijakan");

    // Verifikasi formatting header
    expect(headerRow.font?.bold).toBe(true);
    expect(headerRow.font?.color?.argb).toBe("FFFFFFFF");
    expect(headerRow.fill).toMatchObject({
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    });

    // Verifikasi isi data (Row 2 & Row 3)
    const row2 = worksheet!.getRow(2);
    expect(row2.getCell(1).value).toBe("33.74.05");
    expect(row2.getCell(2).value).toBe("Genuk");
    expect(row2.getCell(3).value).toBe("Pesisir / Industri");
    expect(row2.getCell(4).value).toBe("YA");
    expect(row2.getCell(5).value).toBe(118900);
    expect(row2.getCell(6).value).toBe(88);
    expect(row2.getCell(7).value).toBe(75);
    expect(row2.getCell(8).value).toBe(80);
    expect(row2.getCell(9).value).toBe("Presipitasi Akumulatif & Intrusi Rob");
    expect(row2.getCell(10).value).toBe("Aktivasi pompa polder rob");

    const row3 = worksheet!.getRow(3);
    expect(row3.getCell(1).value).toBe("33.74.01");
    expect(row3.getCell(2).value).toBe("Semarang Tengah");
    expect(row3.getCell(4).value).toBe("TIDAK");
    expect(row3.getCell(5).value).toBe(64200);
    expect(row3.getCell(6).value).toBe(65);
  });

  it("harus mengembalikan status 500 jika terjadi error pada database atau pembuatan workbook", async () => {
    vi.spyOn(db, "select").mockImplementation(() => {
      throw new Error("DB Error");
    });

    const req = new NextRequest("http://localhost:3000/api/export/excel");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toBe("Internal Server Error generating Excel");
  });
});
