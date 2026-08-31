import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { getLatestCitywideVulnerability } from "@/lib/queries";
import { ExecutiveReportDocument } from "@/lib/pdf/executive-report";
import { format, parseISO } from "date-fns";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD").optional(),
});

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

    const targetDateObj = (() => {
      if (!dateParam) return new Date();
      const parsed = parseISO(dateParam);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    })();

    const dateStr = format(targetDateObj, "dd MMMM yyyy");
    const exportFileDate = dateParam ? dateParam.replace(/-/g, "") : format(new Date(), "yyyyMMdd");

    const pdfElement = React.createElement(ExecutiveReportDocument, {
      districts: data,
      generatedAt: dateStr,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = await renderToBuffer(pdfElement);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Sentry_Executive_Brief_${exportFileDate}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return new NextResponse("Internal Server Error generating PDF", { status: 500 });
  }
}
