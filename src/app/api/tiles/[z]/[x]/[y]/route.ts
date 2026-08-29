import { NextRequest, NextResponse } from "next/server";
import { client } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await params;
  const zoom = parseInt(z, 10);
  const tileX = parseInt(x, 10);
  const tileY = parseInt(y, 10);

  if (
    isNaN(zoom) ||
    isNaN(tileX) ||
    isNaN(tileY) ||
    zoom < 0 ||
    zoom > 30 ||
    tileX < 0 ||
    tileY < 0 ||
    tileX >= Math.pow(2, zoom) ||
    tileY >= Math.pow(2, zoom)
  ) {
    return new NextResponse("Invalid tile coordinates", { status: 400 });
  }

  const query = `
    WITH tile_bounds AS (
      SELECT ST_TileEnvelope($1, $2, $3) AS geom
    ),
    mvt_geom AS (
      SELECT 
        d.id,
        d.kemendagri_code,
        d.name,
        d.is_coastal_rob_risk,
        COALESCE(r.composite_vulnerability_score, 0) AS composite_score,
        COALESCE(r.dengue_risk_score, 0) AS dengue_risk,
        COALESCE(r.ispa_risk_score, 0) AS ispa_risk,
        ST_AsMVTGeom(
          ST_Transform(d.centroid, 3857),
          b.geom,
          4096,
          256,
          true
        ) AS geom
      FROM districts d
      CROSS JOIN tile_bounds b
      LEFT JOIN LATERAL (
        SELECT * FROM epidemiological_risk_scores 
        WHERE district_id = d.id 
        ORDER BY score_date DESC 
        LIMIT 1
      ) r ON true
      WHERE ST_Transform(d.centroid, 3857) && b.geom
    )
    SELECT ST_AsMVT(mvt_geom.*, 'districts_layer', 4096, 'geom') AS mvt FROM mvt_geom;
  `;

  try {
    const result = await client.unsafe(query, [zoom, tileX, tileY]);
    const mvtBuffer = result[0]?.mvt;

    if (!mvtBuffer || mvtBuffer.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(mvtBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-protobuf",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Vector tile generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
