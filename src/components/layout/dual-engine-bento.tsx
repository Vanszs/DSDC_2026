"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Copy,
  Check,
  Layers,
  Terminal,
  FileCode2,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DualEngineBentoSection({
  className,
  onOpenSpecs,
}: {
  className?: string;
  onOpenSpecs?: (tab: "openapi" | "postgis" | "kemendagri" | "dsdc") => void;
}) {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"ts" | "curl" | "postgis">("ts");

  const codeSnippets = {
    ts: `import { EcoHealthEngine } from "@ecohealth/pulse-sdk";

const client = new EcoHealthEngine({
  apiKey: process.env.DINKES_API_KEY,
  kemendagriCode: "33.74.05", // Kecamatan Genuk
});

// Inferensi Lag-14 DLNM & Kurva Termal Briere
const telemetry = await client.predictVulnerability({
  date: "2026-08-28",
  vectorModel: "DLNM_BRIERE_HYBRID",
});

console.log(telemetry.ehvScore); // 84 / 100 (Status: Kritis)`,
    curl: `curl -X GET "https://ecohealth.semarangkota.go.id/api/tiles/11/1652/1063" \\
  -H "Accept: application/x-protobuf" \\
  -H "Authorization: Bearer dinkes_sec_key_2026"`,
    postgis: `SELECT ST_AsMVT(mvt_geom.*, 'districts_layer', 4096, 'geom')
FROM (
  SELECT id, kemendagri_code, name,
         ST_AsMVTGeom(ST_Transform(centroid, 3857), ST_TileEnvelope(11, 1652, 1063)) AS geom
  FROM districts WHERE is_coastal_rob_risk = true
) mvt_geom;`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      aria-label="Dual-Engine Architecture: SDK & Realtime Cockpit"
      className={cn(
        "py-16 sm:py-24 border-b border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#080C14] transition-colors duration-150 relative",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading (Crucible B2B Minimalist Style) */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-300/80 bg-white px-3 py-1 text-[11px] font-mono font-semibold text-slate-800 dark:border-slate-800 dark:bg-[#0E1420] dark:text-emerald-400 shadow-xs">
            <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DUAL-CAPABILITY ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            Satu pipeline model inferensi, dua modalitas konsumsi spasial.
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Menyediakan data prediksi risiko penyakit DBD & ISPA melalui antarmuka peta interaktif dan API untuk integrasi sistem dinas kesehatan.
          </p>
        </div>

        {/* Dual Capability Bento Grid (Solid Structural Panels) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* LEFT BOX: EcoHealth API & SDK Developer Console */}
          <div className="relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#E5E0D8] bg-white dark:border-[#1E2638] dark:bg-[#0E1420] shadow-xs space-y-6">
            {/* Top Component: IDE / Terminal Code Block */}
            <div className="relative rounded-xl border border-slate-800 bg-[#0B0F17] p-4 text-slate-100 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeCodeTab === "ts"
                      ? "sdk/predict.ts"
                      : activeCodeTab === "curl"
                      ? "api/v1/tiles/mvt"
                      : "query/spatial.sql"}
                  </span>
                </div>
                <div className="flex items-center gap-1" role="tablist" aria-label="Pilihan format cuplikan kode">
                  {(["ts", "curl", "postgis"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      id={`tab-${tab}`}
                      aria-selected={activeCodeTab === tab}
                      aria-controls="code-snippet-panel"
                      tabIndex={activeCodeTab === tab ? 0 : -1}
                      onClick={() => setActiveCodeTab(tab)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                        activeCodeTab === tab
                          ? "bg-slate-700 text-white shadow-xs"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      )}
                    >
                      {tab === "ts" ? "TypeScript" : tab === "curl" ? "cURL" : "PostGIS SQL"}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors duration-150 motion-reduce:transition-none ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    title={copiedCode ? "Kode Berhasil Disalin" : "Salin Kode"}
                    aria-label={copiedCode ? "Kode berhasil disalin ke clipboard" : "Salin kode ke clipboard"}
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="sr-only" aria-live="polite">
                      {copiedCode ? "Kode berhasil disalin" : ""}
                    </span>
                  </button>
                </div>
              </div>

              <pre
                role="tabpanel"
                id="code-snippet-panel"
                aria-labelledby={`tab-${activeCodeTab}`}
                tabIndex={0}
                className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300 font-mono py-1 max-h-48 scrollbar-thin focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-700 rounded"
              >
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
                  MVT Binary Protocol • ST_AsMVT
                </span>
                <span className="tabular-nums text-slate-300">Edge Cache: 300s</span>
              </div>
            </div>

            {/* Bottom Content: Title, Description, Button */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  <FileCode2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>SDK / REST API / VECTOR TILES</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  EcoHealth API & SDK
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Integrasikan prediksi kerentanan iklim langsung ke portal SatuSehat atau dashboard internal melalui REST endpoint dan binary Vector Tiles MVT.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenSpecs ? onOpenSpecs("openapi") : handleCopyCode()}
                  className="rounded-lg bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold hover:bg-black dark:bg-[#FAF8F5] dark:text-slate-900 dark:hover:bg-white transition-colors duration-150 motion-reduce:transition-none shadow-xs flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>Akses Dokumentasi API</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-[#1E2638] dark:bg-[#080C14] dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors duration-150 motion-reduce:transition-none shadow-xs flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? "Tersalin" : "Salin Cuplikan"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT BOX: EcoHealth Realtime Spatial Cockpit */}
          <div className="relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#E5E0D8] bg-white dark:border-[#1E2638] dark:bg-[#0E1420] shadow-xs space-y-6">
            {/* Top Component: Realtime Spatial HUD & Telemetry Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Left Subcard: Spatial Triage Status HUD */}
              <div className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-3.5 dark:border-slate-800 dark:bg-[#0B0F17] shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider">
                    Telemetri Wilayah
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-red-700 dark:text-red-300 bg-red-100/80 dark:bg-red-950/80 px-1.5 py-0.5 rounded-md border border-red-200 dark:border-red-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse motion-reduce:animate-none" />
                    WASPADA TINGGI
                  </span>
                </div>
                
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Kecamatan Genuk</span>
                    <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">33.74.05</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                    <span className="text-slate-600 dark:text-slate-400">Skor Kerentanan (EHV)</span>
                    <span className="font-bold text-red-600 dark:text-red-400 tabular-nums">84 / 100</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] space-y-1 border border-emerald-200 dark:border-emerald-900">
                  <div className="font-bold flex items-center gap-1">
                    <Activity className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>DLNM Lag-14: Puncak H-7</span>
                  </div>
                  <p className="leading-tight text-emerald-800 dark:text-emerald-300">
                    Presipitasi kumulatif dan temperatur termal 28.5°C memicu lonjakan kesesuaian vektor DBD 88%.
                  </p>
                </div>
              </div>

              {/* Right Subcard: MapLibre Spatial Engine Widget */}
              <div className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-3.5 dark:border-slate-800 dark:bg-[#0B0F17] shadow-xs space-y-2.5 text-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider">
                      MapLibre Spasial
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      MVT 4096 px
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 text-white text-[10px] font-mono space-y-1.5 border border-slate-800">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Briere 28.5°C</span>
                      <span className="tabular-nums">Optimum Aedes</span>
                    </div>
                    <div className="text-slate-400 text-[9px]">Lat: -6.9631 | Lng: 110.4856</div>
                    <div className="text-amber-400 text-[9px] flex items-center justify-between">
                      <span>Polder Sriwulan</span>
                      <span className="font-bold">Pompa Aktif</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                  <span>16 Kecamatan Terpantau</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">PostGIS Live</span>
                </div>
              </div>
            </div>

            {/* Bottom Content: Title, Description, Button */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>COMMAND CONSOLE / MAPLIBRE / SCRUBBER</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                  EcoHealth Realtime Cockpit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Antarmuka pemantauan geospasial real-time dengan timeline scrubber 8-hari, dekomposisi 3 penyakit, dan ekspor instan SOP kebijakan untuk Dinas Kesehatan.
                </p>
              </div>

              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold hover:bg-black dark:bg-[#FAF8F5] dark:text-slate-900 dark:hover:bg-white transition-colors duration-150 motion-reduce:transition-none shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white"
                >
                  <span>Buka Realtime Cockpit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
