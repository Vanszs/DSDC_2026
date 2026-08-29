import { NextRequest, NextResponse } from "next/server";
import { getLatestCitywideVulnerability } from "@/lib/queries";
import { format } from "date-fns";
import { z } from "zod";

const querySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD")
    .optional(),
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateQuery = searchParams.get("date") ?? undefined;

    const parseResult = querySchema.safeParse({ date: dateQuery });
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Bad Request",
          details: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    const targetDate = parseResult.data.date ?? format(new Date(), "yyyy-MM-dd");
    const data = await getLatestCitywideVulnerability(targetDate);

    return NextResponse.json(
      {
        status: "success",
        date: targetDate,
        totalDistricts: data.length,
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
