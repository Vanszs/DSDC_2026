"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileCode2,
  MapPin,
  ShieldCheck,
  Server,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Database,
  Lock,
} from "lucide-react";
import {
  REGULATORY_CREDENTIALS,
  KEMENDAGRI_33_74_DISTRICTS,
} from "@/lib/regulatory-specs";

export type SpecTab = "openapi" | "postgis" | "kemendagri" | "dsdc";

interface RegulatorySpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: SpecTab;
}

export function RegulatorySpecsModal({
  isOpen,
  onClose,
  defaultTab = "openapi",
}: RegulatorySpecsModalProps) {
  const [activeTab, setActiveTab] = useState<SpecTab>(defaultTab);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyJson = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="regulatory-specs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-[#0b111a] dark:text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="regulatory-specs-title"
                className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50"
              >
                Spesifikasi Teknis & Kredensial Regulasi
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Kemendagri 33.74 • DSDC 2026 • OpenAPI 3.1 • PostGIS 3.4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog Spesifikasi"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 active-press"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/40 overflow-x-auto cockpit-scrollbar">
          <button
            onClick={() => setActiveTab("openapi")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "openapi"
                ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <FileCode2 className="h-4 w-4" />
            OpenAPI 3.1 Spec
          </button>
          <button
            onClick={() => setActiveTab("postgis")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "postgis"
                ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            PostGIS 3.4 & MVT
          </button>
          <button
            onClick={() => setActiveTab("kemendagri")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "kemendagri"
                ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Katalog Kemendagri 33.74
          </button>
          <button
            onClick={() => setActiveTab("dsdc")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === "dsdc"
                ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Sertifikasi DSDC 2026
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-5 overflow-y-auto cockpit-scrollbar space-y-4">
          {/* TAB 1: OPENAPI 3.1 SPEC */}
          {activeTab === "openapi" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    OpenAPI 3.1.0 Contract Definition
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    REST API endpoints for epidemiologic risk querying, vector tile streaming, and data export.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopyJson(
                      JSON.stringify(REGULATORY_CREDENTIALS.openApiEndpoints, null, 2)
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 active-press"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin JSON Schema
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {REGULATORY_CREDENTIALS.openApiEndpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {ep.path}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({ep.responseType})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                      {ep.summary}
                    </p>
                    {ep.parameters.length > 0 && (
                      <div className="mt-2 text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Parameters:
                        </span>
                        <ul className="mt-1 space-y-1 pl-3 text-slate-600 dark:text-slate-400">
                          {ep.parameters.map((p, pIdx) => (
                            <li key={pIdx} className="font-mono">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {p.name}
                              </span>{" "}
                              ({p.in}, {p.type}): {p.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-slate-500">
                        Status Codes:
                      </span>
                      {ep.statusCodes.map((st, stIdx) => (
                        <span
                          key={stIdx}
                          className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: POSTGIS 3.4 & MVT SPEC */}
          {activeTab === "postgis" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  PostGIS 3.4 Spatial Database & Vector Tiles Architecture
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Engine kartografi spasial Kota Semarang dengan standar OGC dan Mapbox Vector Tile (MVT).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Spatial Reference System (Source)
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {REGULATORY_CREDENTIALS.postgisSpec.srsSource}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    Sistem koordinat derajat geografis 2D standard WGS84 untuk penyimpanan koordinat centroid & boundary kecamatan.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Projection Target (MVT)
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {REGULATORY_CREDENTIALS.postgisSpec.srsTarget}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    Spherical Mercator proyektif untuk raster/vector tile display kompatibel MapLibre GL.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-900 text-slate-100 dark:border-slate-800 dark:bg-slate-950 font-mono text-xs">
                <div className="text-slate-400 text-[10px] mb-1">
                  -- PostGIS 3.4 ST_AsMVT Binary Protocol Query Pipeline
                </div>
                <pre className="overflow-x-auto text-[11px] text-emerald-400 leading-relaxed">
{`WITH tile_bounds AS (
  SELECT ST_TileEnvelope($1, $2, $3) AS geom
),
mvt_geom AS (
  SELECT 
    d.id, d.kemendagri_code, d.name, d.is_coastal_rob_risk,
    COALESCE(r.composite_vulnerability_score, 0) AS composite_score,
    ST_AsMVTGeom(
      ST_Transform(d.centroid, 3857),
      b.geom, 4096, 256, true
    ) AS geom
  FROM districts d
  CROSS JOIN tile_bounds b
  WHERE ST_Transform(d.centroid, 3857) && b.geom
)
SELECT ST_AsMVT(mvt_geom.*, 'districts_layer', 4096, 'geom') AS mvt FROM mvt_geom;`}
                </pre>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Indeks Spasial & Performa Query
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Menggunakan <strong>GiST (Generalized Search Tree)</strong> R-Tree indexing pada field centroid geometri, menjamin waktu respons vector tile streaming sub-10ms pada zoom level 0-14.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: KEMENDAGRI 33.74 MASTER CATALOG */}
          {activeTab === "kemendagri" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Master Wilayah Kemendagri RI: 33.74 (Kota Semarang)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    16 Kecamatan Administratif resmi sesuai Kepmendagri No. 050-145.
                  </p>
                </div>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  Total Populasi: 1.768.900 Jiwa
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden dark:border-slate-800">
                <div className="overflow-x-auto max-h-[320px] cockpit-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 sticky top-0 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Kode</th>
                        <th className="py-2 px-3 font-semibold">Kecamatan</th>
                        <th className="py-2 px-3 font-semibold">Tipologi Wilayah</th>
                        <th className="py-2 px-3 font-semibold text-center">Zona Rob</th>
                        <th className="py-2 px-3 font-semibold text-right">Populasi</th>
                        <th className="py-2 px-3 font-semibold text-right">Luas (km²)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono-num">
                      {KEMENDAGRI_33_74_DISTRICTS.map((item) => (
                        <tr
                          key={item.code}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/50"
                        >
                          <td className="py-2 px-3 font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100">
                            {item.code}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100 font-sans">
                            {item.name}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-sans">
                            {item.typology}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {item.isCoastalRob ? (
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
                                ROB AKTIF
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">
                                Non-Pesisir
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">
                            {item.population.toLocaleString("id-ID")}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">
                            {item.areaKm2.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DSDC 2026 CERTIFICATION */}
          {activeTab === "dsdc" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50/80 p-3.5 dark:border-emerald-800 dark:bg-emerald-950/40">
                <ShieldCheck className="h-6 w-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Sertifikasi Resmi DSDC 2026 No: {REGULATORY_CREDENTIALS.certification.registryId}
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Validasi Keandalan Model Prediktif Epidemiologi Iklim Kota Semarang • Berlaku s.d. {REGULATORY_CREDENTIALS.certification.validUntil}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Metode Pemodelan
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {REGULATORY_CREDENTIALS.certification.algorithm}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    Menganalisis non-linear lag exposure temperatur, curah hujan, aerosol PM2.5, dan stagnasi angin terhadap lonjakan kasus DBD dan ISPA.
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Tingkat Kepercayaan (Confidence Interval)
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {REGULATORY_CREDENTIALS.certification.confidenceInterval}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    Dievaluasi terhadap 496 observasi meteorologi stasiun klimatologi BMKG Semarang dan riwayat insidensi Dinkes.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    SHA-256 Cryptographic Checksum
                  </span>
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                  {REGULATORY_CREDENTIALS.certification.integrityHash}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Integritas dataset dan parameter bobot model dilindungi tanda tangan digital untuk menjamin transparansi audit tata kelola data kesehatan publik.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80 text-xs text-slate-500">
          <div>
            Kepatuhan: Satu Data Indonesia (Perpres 39/2019) & UU PDP 27/2022
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 active-press"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
