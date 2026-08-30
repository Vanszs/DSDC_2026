import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getLatestCitywideVulnerability } from "@/lib/queries";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date") ?? undefined;
    const data = await getLatestCitywideVulnerability(dateParam);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sentry Platform";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Kerentanan Semarang");

    sheet.columns = [
      { header: "Kode Kemendagri", key: "code", width: 16 },
      { header: "Nama Kecamatan", key: "name", width: 22 },
      { header: "Tipologi", key: "typology", width: 22 },
      { header: "Rawan Rob", key: "rob", width: 12 },
      { header: "Populasi", key: "pop", width: 14 },
      { header: "Skor Bahaya (0-100)", key: "ehv", width: 18 },
      { header: "DBD Risk (%)", key: "dbd", width: 14 },
      { header: "ISPA Risk (%)", key: "ispa", width: 14 },
      { header: "Faktor Pemicu Utama", key: "factor", width: 32 },
      { header: "Rekomendasi Kebijakan", key: "rec", width: 45 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" },
    };

    data.forEach((d) => {
      sheet.addRow({
        code: d.kemendagriCode,
        name: d.name,
        typology: d.typology,
        rob: d.isCoastalRob ? "YA" : "TIDAK",
        pop: d.population,
        ehv: d.compositeScore,
        dbd: d.dengueRisk,
        ispa: d.ispaRisk,
        factor: d.primaryFactor,
        rec: d.recommendation,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Sentry_Dataset_Semarang_${format(new Date(), "yyyyMMdd")}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel Export Error:", error);
    return new NextResponse("Internal Server Error generating Excel", { status: 500 });
  }
}
