"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  FileCode2,
  Layers,
  Database,
  Lock,
  Activity,
  Radio,
  ExternalLink,
  MapPin,
  FileSpreadsheet,
  FileText,
  Cpu,
} from "lucide-react";
import { RegulatorySpecsModal, SpecTab } from "./regulatory-specs-modal";
import { REGULATORY_CREDENTIALS } from "@/lib/regulatory-specs";

export function EnterpriseFooter({
  onOpenSpecs,
}: {
  onOpenSpecs?: (tab: SpecTab) => void;
} = {}) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<SpecTab>("openapi");

  const openSpecModal = (tab: SpecTab) => {
    if (onOpenSpecs) {
      onOpenSpecs(tab);
      return;
    }
    setActiveTab(tab);
    setModalOpen(true);
  };

  return (
    <>
      <footer
        role="contentinfo"
        aria-label="Footer Otoritas & Kepatuhan Regulasi Enterprise"
        className="mt-12 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#080d14] text-slate-900 dark:text-slate-100 transition-colors duration-150"
      >
        {/* Top Regulatory Governance & Verification Strip */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0b111a]/70 py-3">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                DSDC 2026 CERTIFIED
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                Reg No: {REGULATORY_CREDENTIALS.certification.registryId}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">
                Data Kepatuhan: Kemendagri 33.74 (Kota Semarang)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => openSpecModal("openapi")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:border-slate-400 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300 dark:hover:bg-slate-800 active-press shadow-sm"
              >
                <FileCode2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                OpenAPI 3.1 Spec
              </button>
              <button
                onClick={() => openSpecModal("postgis")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:border-slate-400 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300 dark:hover:bg-slate-800 active-press shadow-sm"
              >
                <Layers className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                PostGIS 3.4 MVT
              </button>
              <button
                onClick={() => openSpecModal("kemendagri")}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-[#FAF8F5] hover:border-slate-400 dark:border-slate-700 dark:bg-[#0E1420] dark:text-slate-300 dark:hover:bg-slate-800 active-press shadow-sm"
              >
                <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Master 33.74
              </button>
            </div>
          </div>
        </div>

        {/* Main Enterprise Footer Content Grid */}
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            {/* Column 1: System Identity & Regulatory Mandate (Col Span 4) */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm shrink-0">
                  <Activity className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Sentry
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">
                    Data Science & Analytics Development Center (DSDC 2026)
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Platform intelijen epidemiologi prediktif Kota Semarang mengintegrasikan anomali iklim BMKG, pemodelan lag non-linear (DLNM 14-Day Lag), dan kartografi spasial PostGIS untuk mitigasi dini DBD dan ISPA.
              </p>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Kode Wilayah Kemendagri:
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    33.74 (Kota Semarang)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Cakupan Spasial:
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    16 Kecamatan • 177 Kelurahan
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Landasan Hukum:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-[10px]">
                    Kepmendagri No. 050-145
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Data Compliance & Cryptographic Proof (Col Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Tata Kelola & Audit Data
              </h4>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Satu Data Indonesia
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Interoperabilitas metadata spasial Perpres No. 39/2019.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      UU Pelindungan Data Pribadi
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Agregasi spasial level kecamatan anonim UU No. 27/2022.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <button
                      onClick={() => openSpecModal("dsdc")}
                      className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400 text-left"
                    >
                      Audit Trail SHA-256
                    </button>
                    <p className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">
                      {REGULATORY_CREDENTIALS.certification.integrityHash}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Technical Specifications & Vector APIs (Col Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Spesifikasi API & Spasial
              </h4>

              <div className="space-y-2 text-xs">
                <div className="rounded border border-slate-200 p-2 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100">
                      GET /api/analytics
                    </span>
                    <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-mono text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      200 OK
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    JSON payload 16 kecamatan skor EHV
                  </p>
                </div>

                <div className="rounded border border-slate-200 p-2 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100">
                      GET /api/tiles/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;
                    </span>
                    <span className="rounded bg-slate-200 px-1 py-0.2 text-[9px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      MVT Proto
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    PostGIS 3.4 ST_AsMVT vector streaming
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openSpecModal("openapi")}
                    className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400 flex items-center gap-1"
                  >
                    Buka Dokumentasi OpenAPI <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 4: Quick Portals & Navigation (Col Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Navigasi Portal
              </h4>

              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Beranda Ikhtisar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Cockpit Realtime
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Login Otoritas (SSO)
                  </Link>
                </li>
                <li>
                  <a
                    href="/api/export/pdf"
                    download
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" /> Unduh PDF
                  </a>
                </li>
                <li>
                  <a
                    href="/api/export/excel"
                    download
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3 w-3" /> Unduh Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Strategic Stakeholders Authority Row */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Otoritas Terhubung & Jaringan Data Resmi:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <Radio className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  Dinas Kesehatan Kota Semarang
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <Building2 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  Bappeda Kota Semarang
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <Database className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  BMKG Stasiun Klimatologi Semarang
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  Kemenkes SatuSehat
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  UNDIP Lab
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright & Accessibility Bar */}
        <div className="border-t border-slate-200 bg-slate-100/80 px-3 py-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#06090e] dark:text-slate-400">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                © 2026 Pemerintah Kota Semarang & Tim Rekayasa DSDC 2026
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Hak Cipta Dilindungi Undang-Undang</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span>Model: DLNM Lag-14</span>
              <span>•</span>
              <span>PostGIS 3.4</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                WCAG AA 4.5:1 Accessible
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Specifications Inspector Modal */}
      <RegulatorySpecsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={activeTab}
      />
    </>
  );
}
