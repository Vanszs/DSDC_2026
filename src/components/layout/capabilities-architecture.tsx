"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Database,
  Layers,
  FileCheck2,
  Activity,
  Droplets,
  Wind,
  Bug,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Code2,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PillarId = "dlnm" | "postgis" | "triage" | "policy";

interface ArchitecturePillar {
  id: PillarId;
  number: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
  specSummary: string;
  keyMetrics: { label: string; value: string; detail: string }[];
  technicalPillars: {
    heading: string;
    description: string;
    codeSnippet?: string;
  }[];
  domainKeywords: string[];
}

export const ARCHITECTURE_PILLARS: ArchitecturePillar[] = [
  {
    id: "dlnm",
    number: "01",
    badgeLabel: "CORE EPIDEMIOLOGICAL KERNEL",
    title: "Climatology DLNM Engine",
    subtitle: "Distributed Lag Non-linear Models (14-Day Cross-Basis Matrix)",
    specSummary:
      "Pemodelan matematika non-linear yang menangkap efek tunda (lag exposure-response) fluktuasi mikroklimat BMKG terhadap masa inkubasi ekstrinsik (EIP) vektor dan masa hidup patogen.",
    keyMetrics: [
      {
        label: "Lag Window",
        value: "14 Hari",
        detail: "Cross-basis bioklimatik H-0 s.d H-13",
      },
      {
        label: "Optimum Termal",
        value: "28.5 °C",
        detail: "Kurva Briere non-linear Aedes aegypti",
      },
      {
        label: "Confidence Interval",
        value: "95% CI",
        detail: "Validasi Poisson overdispersion quasi-AIC",
      },
    ],
    technicalPillars: [
      {
        heading: "Termal Briere Vector Suitability",
        description:
          "Menghitung kapasitas vektor transmisi DBD melalui fungsi Briere terkalibrasi batas termal T_min 16.0 °C dan T_max 36.0 °C dengan puncak kesesuaian biologi pada 28.5 °C.",
        codeSnippet: `// Briere Non-Linear Thermal Function
const T_MIN = 16.0, T_MAX = 36.0, C = 0.000147;
const raw = C * T * (T - T_MIN) * Math.sqrt(T_MAX - T);
const suitability = raw / peakSuitability; // Normalized 0..1`,
      },
      {
        heading: "Lagged Rainfall Decay Distribution",
        description:
          "Presipitasi kumulatif 14-hari dibobotkan dengan kernel log-normal. Puncak sensitivitas genangan terjadi pada H-6 hingga H-7 setelah hujan deras, waktu krusial pembentukan sarang nyamuk.",
        codeSnippet: `// 14-Day Distributed Lag Coefficients
const weights = [
  0.009, 0.021, 0.045, 0.081, 0.125, 0.165, 0.185,
  0.176, 0.142, 0.098, 0.058, 0.029, 0.012, 0.004
];
const rainLagScore = sum(rainfall14[i] * weights[i]) / 45.0;`,
      },
      {
        heading: "Wang-Angell Atmospheric Stagnation Index",
        description:
          "Mengukur stagnasi lapisan batas atmosfer permukaan Kota Semarang untuk memprediksi akumulasi polutan partikulat PM2.5 dan pemicu infeksi saluran pernapasan balita.",
        codeSnippet: `// Stagnation & Particulate Load Model
const windStagnation = Math.max(0, 1.0 - windSpeedKmh / 15.0);
const pm25Load = Math.min(1.0, pm25 / 120.0);
const ispaRisk = (pm25Load * 0.45 + windStagnation * 0.25) * 100;`,
      },
    ],
    domainKeywords: [
      "Briere Suitability",
      "DLNM 14-Day Lag",
      "API-5 Index",
      "Overdispersion Quasi-Poisson",
      "Micro-meteorology BMKG",
    ],
  },
  {
    id: "postgis",
    number: "02",
    badgeLabel: "SPATIAL BIG DATA STREAMING",
    title: "PostGIS Vector Pipeline",
    subtitle: "High-Performance ST_AsMVT Binary Protocol Buffer Streaming",
    specSummary:
      "Arsitektur geospasial relasional berbasis PostgreSQL 16 + PostGIS 3.4 yang menyajikan poligon batas administrasi 16 kecamatan Semarang dalam format Mapbox Vector Tile (MVT) terkompresi.",
    keyMetrics: [
      {
        label: "Render Tile Latency",
        value: "< 18 ms",
        detail: "Eksekusi native PostGIS binary buffer",
      },
      {
        label: "Format Protokol",
        value: "Protobuf MVT",
        detail: "MIME application/x-protobuf",
      },
      {
        label: "Proyeksi Spasial",
        value: "EPSG:3857",
        detail: "Web Mercator dengan bounding ST_TileEnvelope",
      },
    ],
    technicalPillars: [
      {
        heading: "Native On-the-Fly Tile Slicing",
        description:
          "Tile vektor digenerasi langsung di tingkat basis data menggunakan fungsi `ST_AsMVTGeom` dan `ST_TileEnvelope`, mengeliminasi layer middleware GIS yang berat.",
        codeSnippet: `WITH tile_bounds AS (
  SELECT ST_TileEnvelope($1, $2, $3) AS geom
),
mvt_geom AS (
  SELECT d.id, d.kemendagri_code, d.name,
    ST_AsMVTGeom(ST_Transform(d.centroid, 3857), b.geom, 4096, 256, true) AS geom
  FROM districts d CROSS JOIN tile_bounds b
)
SELECT ST_AsMVT(mvt_geom.*, 'districts_layer', 4096, 'geom') AS mvt FROM mvt_geom;`,
      },
      {
        heading: "Drizzle ORM Centroid & GeoJSON Integration",
        description:
          "Pemetaan skema relasional terstruktur dengan tipe kustom Centroid GeoJSON `{ lat, lng }` yang menjaga integritas titik acuan puskesmas dan sensor cuaca.",
        codeSnippet: `// Drizzle Custom Centroid Type
export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  kemendagriCode: varchar("kemendagri_code", { length: 20 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  centroid: jsonb("centroid").$type<{ lat: number; lng: number }>().notNull(),
});`,
      },
      {
        heading: "WebGL 60 FPS Client-Side Rendering",
        description:
          "Integrasi MapLibre GL tanpa API Key komersial pihak ketiga. Rendering dinamis choropleth warna Bio-Emerald, Amber, dan Crimson Hazard langsung di GPU.",
        codeSnippet: `// MapLibre Dynamic Layer Data Source
map.addSource('districts-mvt', {
  type: 'vector',
  tiles: ['/api/tiles/{z}/{x}/{y}'],
  maxzoom: 14
});`,
      },
    ],
    domainKeywords: [
      "ST_AsMVT",
      "ST_TileEnvelope",
      "PostGIS 3.4",
      "Vector Tiles Protobuf",
      "Kemendagri 33.74",
    ],
  },
  {
    id: "triage",
    number: "03",
    badgeLabel: "CLINICAL TRIAGE MATRIX",
    title: "Dual-Disease Triage Matrix",
    subtitle: "Sentry Vulnerability (EHV 0-100) Dual-Pathogen Scoring",
    specSummary:
      "Matriks penilaian komposit kuantitatif yang mendekomposisi risiko dua spektrum penyakit menular iklim: DBD (vektor Aedes) dan ISPA (aerosol PM2.5).",
    keyMetrics: [
      {
        label: "Rentang Skor EHV",
        value: "0 - 100",
        detail: "Skala keparahan kuantitatif komposit",
      },
      {
        label: "Ambang Kritis",
        value: "EHV ≥ 70",
        detail: "Aktivasi tanggap darurat dinas",
      },
      {
        label: "Dekomposisi Penyakit",
        value: "2 Vektor",
        detail: "DBD 60%, ISPA 40%",
      },
    ],
    technicalPillars: [
      {
        heading: "Pembobotan Komposit EHV (Formula Terkalibrasi)",
        description:
          "Formula matematis baku menggabungkan risiko dua penyakit dengan bobot proporsional beban klinis rumah sakit di Kota Semarang.",
        codeSnippet: `// Komposit EHV Calculation (DBD 60% : ISPA 40%)
const compositeScore = Math.round(
  dengueRisk * 0.60 + 
  ispaRisk * 0.40
);
const triageLevel = compositeScore >= 70 ? 'CRITICAL' : compositeScore >= 45 ? 'WARNING' : 'NORMAL';`,
      },
      {
        heading: "Wang-Angell Atmospheric Stagnation Model",
        description:
          "Zona urban dengan ventilasi atmosferik rendah mendapatkan faktor akumulasi polutan partikulat PM2.5 dan gas buang kendaraan.",
        codeSnippet: `// Atmospheric Stagnation & PM2.5 Index
const asi = computeAtmosphericStagnationIndex(windSpeedKmh, humidityAvg);
const isStagnant = windSpeedKmh <= 11.0;
const ispaRisk = Math.min(100, (pm25 / 50.0) * 50 + (isStagnant ? 25 : 10));`,
      },
      {
        heading: "Klasifikasi Triage Klinis 16 Kecamatan",
        description:
          "Tabel klasifikasi otomatis mengelompokkan 16 kecamatan ke dalam 3 tier tanggap: Siaga Merah (EHV ≥70), Siaga Kuning (EHV 45-69), dan Hijau Terkendali (EHV <45).",
        codeSnippet: `// Triage Status Assignment
export function getTriageStatus(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "Siaga Kritis", color: "#DC2626" };
  if (score >= 45) return { label: "Waspada", color: "#D97706" };
  return { label: "Aman", color: "#059669" };
}`,
      },
    ],
    domainKeywords: [
      "EHV Score 0-100",
      "Stagnation Threshold",
      "Dual-Pathogen Breakdown",
      "Aedes Index",
      "Kapasitas Puskesmas",
    ],
  },
  {
    id: "policy",
    number: "04",
    badgeLabel: "AUTOMATED ACTION PROTOCOLS",
    title: "Automated Policy SOP",
    subtitle: "Evidence-Based Intervention Engine for Dinkes & Bappeda",
    specSummary:
      "Mesin translasi analitik ke dalam SOP operasional terstandarisasi. Menghasilkan rekomendasi logistik instan, distribusi APD sepatu bot, aktivasi pompa polder rob, dan ekspor berkas dinas.",
    keyMetrics: [
      {
        label: "Waktu Hasilkan SOP",
        value: "Instan",
        detail: "Algoritmik deterministik otomatis",
      },
      {
        label: "Ekspor Berkas",
        value: "PDF & Excel",
        detail: "Executive Brief & Dataset OpenXML",
      },
      {
        label: "Integrasi Regulasi",
        value: "SatuSehat",
        detail: "Kemenkes Permenkes 24/2022 & RAD-API",
      },
    ],
    technicalPillars: [
      {
        heading: "SOP Translasi Lapangan Berdasarkan Pemicu",
        description:
          "Sistem secara otomatis mendeteksi faktor dominan (Kapasitas Termal DBD atau Polusi ISPA) dan memetakan aksi intervensi baku lapangan.",
        codeSnippet: `if (dengueRisk >= ispaRisk) {
  primaryFactor = "Kapasitas Termal Vektor Aedes";
  recommendation = "Lakukan PSN 3M Plus, larvasidasi temephos di permukiman padat.";
} else {
  primaryFactor = "Konsentrasi Partikulat Aerosol PM2.5";
  recommendation = "Pemberlakuan peringatan kualitas udara dan pembagian masker medis.";
}`,
      },
      {
        heading: "Ekspor Dokumen Eksekutif Streaming PDF",
        description:
          "Generator dokumen PDF berbasis `@react-pdf/renderer` yang memformat laporan 16 kecamatan secara elegan dengan standar administrasi kepemerintahan.",
        codeSnippet: `// Server-Side PDF Streaming Response
const stream = await ReactPDF.renderToStream(
  <ExecutiveReportDocument districts={data} generatedAt={dateStr} />
);
return new NextResponse(stream as any, {
  headers: { "Content-Type": "application/pdf" }
});`,
      },
      {
        heading: "Dataset Audit OpenXML Excel",
        description:
          "Penyediaan tabel terstruktur format Excel XLSX lengkap dengan formula, metadata dinas, dan parameter mikroklimat untuk verifikasi saintifik Bappeda.",
        codeSnippet: `// ExcelJS Streaming Buffer Generation
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Kerentanan Semarang");
sheet.columns = [...columnsSchema];
data.forEach((d) => sheet.addRow({ ...d }));
const buffer = await workbook.xlsx.writeBuffer();`,
      },
    ],
    domainKeywords: [
      "SOP Intervensi Dinkes",
      "PSN 3M Plus",
      "Polderisasi Rob Bandarharjo",
      "PDF Executive Brief",
      "Excel OpenXML Dataset",
    ],
  },
];

export const CapabilitiesArchitectureSection: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [activePillarId, setActivePillarId] = useState<PillarId>("dlnm");

  const activePillar =
    ARCHITECTURE_PILLARS.find((p) => p.id === activePillarId) ??
    ARCHITECTURE_PILLARS[0];

  return (
    <section
      id="arsitektur-kapabilitas"
      aria-label="Arsitektur Ontologis dan 4 Pilar Kapabilitas Sentry"
      className={cn(
        "py-16 sm:py-24 border-b border-[#E5E0D8] bg-[#FFFFFF] dark:border-[#1E2638] dark:bg-[#0E1420] transition-colors",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header: Authentic B2B Enterprise Directives */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50/80 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ARSITEKTUR SISTEM & 4 PILAR KAPABILITAS ONTOLOGIS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#181818] dark:text-[#F8FAFC] leading-tight">
            Infrastruktur Analitik Epidemiologi & Rekayasa Spasial Skala Kota
          </h2>

          <p className="text-sm sm:text-base text-[#645E54] dark:text-[#94A3B8] leading-relaxed">
            Didefinisikan secara modular untuk kebutuhan Dinas Kesehatan Kota Semarang, Bappeda, dan Stasiun Klimatologi BMKG dalam mengantisipasi ancaman wabah berbasis bukti kuantitatif.
          </p>
        </div>

        {/* 4 Pillars Interactive Tab Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {ARCHITECTURE_PILLARS.map((pillar) => {
            const isActive = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={cn(
                  "flex flex-col text-left p-3.5 sm:p-4 rounded-xl border transition-all active-press",
                  isActive
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                    : "border-[#E5E0D8] bg-[#FAF8F5] hover:bg-slate-100/90 dark:border-[#1E2638] dark:bg-[#080C14] dark:hover:bg-slate-900/60 text-[#181818] dark:text-[#F8FAFC]"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={cn(
                      "font-mono text-xs font-bold px-2 py-0.5 rounded",
                      isActive
                        ? "bg-emerald-600 text-white dark:bg-emerald-500"
                        : "bg-slate-200 text-[#181818] dark:bg-slate-800 dark:text-[#F8FAFC]"
                    )}
                  >
                    PILAR {pillar.number}
                  </span>
                  {isActive && (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>

                <div className="font-bold text-sm text-[#181818] dark:text-[#F8FAFC] line-clamp-1">
                  {pillar.title}
                </div>
                <div className="text-[11px] text-[#645E54] dark:text-[#94A3B8] font-mono mt-0.5 line-clamp-1">
                  {pillar.badgeLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Deep-Dive Asymmetric Workbench */}
        <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 sm:p-8 dark:border-[#1E2638] dark:bg-[#080C14] shadow-sm space-y-8">
          {/* Pillar Top Overview */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#E5E0D8] dark:border-[#1E2638]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  PILAR {activePillar.number} : {activePillar.badgeLabel}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#181818] dark:text-[#F8FAFC]">
                {activePillar.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[#645E54] dark:text-[#94A3B8]">
                {activePillar.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-[#181818] dark:text-[#F8FAFC] leading-relaxed pt-1">
                {activePillar.specSummary}
              </p>
            </div>

            {/* Quick Metrics Badge Column */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0 min-w-[260px]">
              {activePillar.keyMetrics.map((km, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E5E0D8] bg-white p-3 dark:border-[#1E2638] dark:bg-[#0E1420]"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#645E54] dark:text-[#94A3B8]">
                    {km.label}
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#181818] dark:text-[#F8FAFC]">
                    {km.value}
                  </div>
                  <div className="text-[11px] text-[#645E54] dark:text-[#94A3B8] leading-tight mt-0.5">
                    {km.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Technical Sub-Components Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {activePillar.technicalPillars.map((tp, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-[#E5E0D8] bg-white p-4 sm:p-5 dark:border-[#1E2638] dark:bg-[#0E1420] space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-[#181818] dark:text-[#F8FAFC]">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#181818] dark:text-[#F8FAFC]">
                      {tp.heading}
                    </h4>
                  </div>
                  <p className="text-xs text-[#645E54] dark:text-[#94A3B8] leading-relaxed">
                    {tp.description}
                  </p>
                </div>

                {tp.codeSnippet && (
                  <div className="rounded-lg bg-[#090D16] p-3 text-slate-200 font-mono text-[11px] overflow-x-auto border border-[#1E2638] cockpit-scrollbar">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-[#1E2638] pb-1.5 mb-2">
                      <span>SPECS IMPLEMENTASI</span>
                      <span className="text-emerald-400">PRODUCTION</span>
                    </div>
                    <pre className="whitespace-pre leading-snug">
                      <code>{tp.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pillar Footer: Authentic Vocabulary Badges & Action Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E5E0D8] dark:border-[#1E2638]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono font-semibold text-[#645E54] uppercase mr-1">
                Kamus Ontologis:
              </span>
              {activePillar.domainKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-[#181818] dark:bg-slate-800 dark:text-[#F8FAFC] border border-[#E5E0D8] dark:border-[#1E2638]"
                >
                  {kw}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <span>Uji Langsung di Realtime Cockpit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
