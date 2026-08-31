import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getLatestCitywideVulnerability } from "@/lib/queries";
import { format } from "date-fns";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
});

function sanitizeExcelCell<T>(val: T): T {
  if (typeof val === "string" && /^[=+\-@\t\r]/.test(val)) {
    return `'${val}` as unknown as T;
  }
  return val;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParamRaw = searchParams.get("date") ?? undefined;
    const parseResult = querySchema.safeParse({ date: dateParamRaw });
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid date format, expected YYYY-MM-DD" },
        { status: 400 }
      );
    }
    const dateParam = parseResult.data.date;
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
        code: sanitizeExcelCell(d.kemendagriCode),
        name: sanitizeExcelCell(d.name),
        typology: sanitizeExcelCell(d.typology),
        rob: d.isCoastalRob ? "YA" : "TIDAK",
        pop: d.population,
        ehv: d.compositeScore,
        dbd: d.dengueRisk,
        ispa: d.ispaRisk,
        factor: sanitizeExcelCell(d.primaryFactor),
        rec: sanitizeExcelCell(d.recommendation),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const exportDateStr = dateParam ? dateParam.replace(/-/g, "") : format(new Date(), "yyyyMMdd");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Sentry_Dataset_Semarang_${exportDateStr}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel Export Error:", error);
    return new NextResponse("Internal Server Error generating Excel", { status: 500 });
  }
}
