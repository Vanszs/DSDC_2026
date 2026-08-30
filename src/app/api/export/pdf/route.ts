import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { getLatestCitywideVulnerability } from "@/lib/queries";
import { ExecutiveReportDocument } from "@/lib/pdf/executive-report";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const data = await getLatestCitywideVulnerability();
    const dateStr = format(new Date(), "dd MMMM yyyy");

    const pdfElement = React.createElement(ExecutiveReportDocument, {
      districts: data,
      generatedAt: dateStr,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = await renderToBuffer(pdfElement);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Sentry_Executive_Brief_${format(new Date(), "yyyyMMdd")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Export Error:", error);
    return new NextResponse("Internal Server Error generating PDF", { status: 500 });
  }
}
