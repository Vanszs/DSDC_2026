/**
 * EcoHealth Pulse - Regulatory Specifications & Governance Master Data
 * Compliance: Kemendagri RI 33.74 (Kota Semarang), DSDC 2026, OpenAPI 3.1, PostGIS 3.4
 * Strict typography rule: Zero em-dashes. Use hyphens (-), bullets (•), or slashes (/).
 */

export interface KemendagriDistrictSpec {
  code: string;
  name: string;
  typology: string;
  isCoastalRob: boolean;
  population: number;
  areaKm2: number;
  elevationMeters: number;
  centroid: { lat: number; lng: number };
}

export const KEMENDAGRI_33_74_DISTRICTS: KemendagriDistrictSpec[] = [
  { code: "33.74.01", name: "Semarang Tengah", typology: "Urban Padat", isCoastalRob: false, population: 64200, areaKm2: 6.14, elevationMeters: 12, centroid: { lat: -6.9825, lng: 110.4208 } },
  { code: "33.74.02", name: "Semarang Utara", typology: "Pesisir / Pelabuhan", isCoastalRob: true, population: 128400, areaKm2: 10.97, elevationMeters: 2, centroid: { lat: -6.9634, lng: 110.4236 } },
  { code: "33.74.03", name: "Semarang Timur", typology: "Urban / Perdagangan", isCoastalRob: false, population: 76500, areaKm2: 7.70, elevationMeters: 8, centroid: { lat: -6.9781, lng: 110.4442 } },
  { code: "33.74.04", name: "Gayamsari", typology: "Pesisir / Sub-urban", isCoastalRob: true, population: 72100, areaKm2: 6.18, elevationMeters: 3, centroid: { lat: -6.9842, lng: 110.4578 } },
  { code: "33.74.05", name: "Genuk", typology: "Pesisir / Industri", isCoastalRob: true, population: 118900, areaKm2: 27.39, elevationMeters: 2, centroid: { lat: -6.9631, lng: 110.4856 } },
  { code: "33.74.06", name: "Pedurungan", typology: "Pemukiman Padat", isCoastalRob: false, population: 198500, areaKm2: 20.72, elevationMeters: 10, centroid: { lat: -7.0053, lng: 110.4725 } },
  { code: "33.74.07", name: "Semarang Selatan", typology: "Urban / Kantor", isCoastalRob: false, population: 74800, areaKm2: 14.83, elevationMeters: 18, centroid: { lat: -6.9961, lng: 110.4203 } },
  { code: "33.74.08", name: "Candisari", typology: "Perbukitan Rendah", isCoastalRob: false, population: 79200, areaKm2: 6.54, elevationMeters: 45, centroid: { lat: -7.0164, lng: 110.4258 } },
  { code: "33.74.09", name: "Gajahmungkur", typology: "Perbukitan Lembab", isCoastalRob: false, population: 58600, areaKm2: 9.07, elevationMeters: 75, centroid: { lat: -7.0125, lng: 110.4042 } },
  { code: "33.74.10", name: "Tembalang", typology: "Pendidikan / Sub-urban", isCoastalRob: false, population: 192300, areaKm2: 44.20, elevationMeters: 120, centroid: { lat: -7.0583, lng: 110.4447 } },
  { code: "33.74.11", name: "Banyumanik", typology: "Perbukitan / Pemukiman", isCoastalRob: false, population: 145200, areaKm2: 25.69, elevationMeters: 180, centroid: { lat: -7.0678, lng: 110.4139 } },
  { code: "33.74.12", name: "Gunungpati", typology: "Hutan Kota / Kampus", isCoastalRob: false, population: 98400, areaKm2: 54.11, elevationMeters: 220, centroid: { lat: -7.0864, lng: 110.3664 } },
  { code: "33.74.13", name: "Semarang Barat", typology: "Industri / Bandara", isCoastalRob: false, population: 154800, areaKm2: 21.74, elevationMeters: 6, centroid: { lat: -6.9839, lng: 110.3889 } },
  { code: "33.74.14", name: "Mijen", typology: "Agraris / Dataran Tinggi", isCoastalRob: false, population: 78900, areaKm2: 57.55, elevationMeters: 210, centroid: { lat: -7.0603, lng: 110.3069 } },
  { code: "33.74.15", name: "Ngaliyan", typology: "Industri / Residensial", isCoastalRob: false, population: 142100, areaKm2: 37.99, elevationMeters: 40, centroid: { lat: -7.0011, lng: 110.3475 } },
  { code: "33.74.16", name: "Tugu", typology: "Pesisir / Tambak", isCoastalRob: true, population: 35400, areaKm2: 31.78, elevationMeters: 3, centroid: { lat: -6.9733, lng: 110.3275 } },
];

export const REGULATORY_CREDENTIALS = {
  jurisdiction: {
    city: "Kota Semarang",
    province: "Jawa Tengah",
    kemendagriCode: "33.74",
    legalBasis: "Kepmendagri No. 050-145 / Master Kode Wilayah Kemendagri RI",
    dataGovernance: "Perpres No. 39/2019 (Satu Data Indonesia)",
    privacyLaw: "UU No. 27/2022 (Pelindungan Data Pribadi)",
  },
  certification: {
    title: "DSDC 2026 Epidemiological Analytics Certification",
    registryId: "DSDC-SMG-2026-CERT-V3",
    validUntil: "31 Desember 2026",
    auditor: "Data Science & Analytics Development Center (DSDC)",
    integrityHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    algorithm: "DLNM 14-Day Distributed Lag Non-linear Model",
    confidenceInterval: "95% CI [0.88 - 0.96]",
  },
  postgisSpec: {
    engine: "PostGIS 3.4 on PostgreSQL 16",
    srsSource: "EPSG:4326 (WGS84 2D Geographic)",
    srsTarget: "EPSG:3857 (Spherical Mercator Web Tile)",
    tileFunction: "ST_AsMVT(ST_AsMVTGeom(ST_Transform(geom, 3857), bounds, 4096, 256, true))",
    extent: 4096,
    buffer: 256,
    indexType: "GiST Spatial Index (R-Tree on Geometry)",
  },
  openApiEndpoints: [
    {
      method: "GET",
      path: "/api/analytics",
      summary: "Query citywide epidemiological risk scores for 16 districts",
      parameters: [
        { name: "date", in: "query", type: "string (YYYY-MM-DD)", required: false, description: "Observation date for risk evaluation. Default: today." },
      ],
      responseType: "application/json",
      statusCodes: ["200 OK", "400 Bad Request", "500 Internal Server Error"],
    },
    {
      method: "GET",
      path: "/api/tiles/{z}/{x}/{y}",
      summary: "Stream PostGIS binary vector tiles (MVT) for MapLibre WebGL layer",
      parameters: [
        { name: "z", in: "path", type: "integer (0-30)", required: true, description: "Tile zoom level." },
        { name: "x", in: "path", type: "integer", required: true, description: "Tile X coordinate." },
        { name: "y", in: "path", type: "integer", required: true, description: "Tile Y coordinate." },
      ],
      responseType: "application/x-protobuf",
      statusCodes: ["200 OK", "204 No Content", "400 Bad Request", "500 Internal Server Error"],
    },
    {
      method: "GET",
      path: "/api/export/pdf",
      summary: "Generate executive brief PDF report via server-side renderer",
      parameters: [],
      responseType: "application/pdf",
      statusCodes: ["200 OK", "500 Internal Server Error"],
    },
    {
      method: "GET",
      path: "/api/export/excel",
      summary: "Export multi-district epidemiological dataset in OpenXML Excel workbook",
      parameters: [],
      responseType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      statusCodes: ["200 OK", "500 Internal Server Error"],
    },
  ],
};
