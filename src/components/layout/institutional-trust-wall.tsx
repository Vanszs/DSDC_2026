"use client";

import React from "react";
import {
  Building2,
  Database,
  Radio,
  HeartPulse,
  Microscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustPartner {
  id: string;
  name: string;
  shortName: string;
  role: string;
  standard: string;
  badge: string;
  category: "Otoritas Kesehatan" | "Perencanaan" | "Klimatologi" | "Interoperabilitas" | "Laboratorium Riset";
  icon: typeof Building2;
  telemetrySource: string;
}

export const INSTITUTIONAL_PARTNERS: TrustPartner[] = [
  {
    id: "dinkes",
    name: "Dinas Kesehatan Kota Semarang",
    shortName: "Dinkes Kota Semarang",
    role: "Otoritas Pelaksana Surveilans Epidemiologi & Tanggap Darurat Klaster",
    standard: "Permenkes RI No. 24/2022",
    badge: "OTORITAS DINAS",
    category: "Otoritas Kesehatan",
    icon: Radio,
    telemetrySource: "SIM-DBD & E-Puskesmas 37 Unit",
  },
  {
    id: "bappeda",
    name: "Bappeda Kota Semarang",
    shortName: "Bappeda Kota Semarang",
    role: "Badan Perencanaan Pembangunan, Rencana Aksi Daerah Mitigasi Iklim",
    standard: "Perpres 39/2019 SDI",
    badge: "PERENCANAAN",
    category: "Perencanaan",
    icon: Building2,
    telemetrySource: "Portal Satu Data Semarang",
  },
  {
    id: "bmkg",
    name: "BMKG Stasiun Klimatologi Semarang",
    shortName: "BMKG Stasiun Klimatologi",
    role: "Penyedia Jaringan AWS (Automatic Weather Station) & Presipitasi",
    standard: "Standar WMO Res 40",
    badge: "KLIMATOLOGI",
    category: "Klimatologi",
    icon: Database,
    telemetrySource: "Stasiun Klimatologi Semarang",
  },
  {
    id: "kemenkes",
    name: "Kemenkes SatuSehat",
    shortName: "Kemenkes SatuSehat",
    role: "Integrasi Rekam Medis Elektronik Nasional & Standarisasi ICD-10",
    standard: "HL7 FHIR & Permenkes",
    badge: "SATUSEHAT",
    category: "Interoperabilitas",
    icon: HeartPulse,
    telemetrySource: "SatuSehat FHIR Gateway",
  },
  {
    id: "undip",
    name: "UNDIP Lab Epidemiologi Tropis",
    shortName: "UNDIP Lab",
    role: "Laboratorium Validasi Entomologi Vektor & Kalibrasi Model DLNM",
    standard: "ISO/IEC 17025",
    badge: "LAB VALIDASI",
    category: "Laboratorium Riset",
    icon: Microscope,
    telemetrySource: "Environmental Health Lab",
  },
];

export function InstitutionalTrustWall({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      id="mitra-institusional"
      aria-label="Mitra Otoritas dan Institusi"
      className={cn(
        "py-8 sm:py-10 border-b border-[#E5E0D8] dark:border-[#1E2638] bg-[#FAF8F5] dark:bg-[#080C14] transition-colors relative overflow-hidden",
        className
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Minimalist Crucible Logo Header */}
        <div className="text-center">
          <p className="text-[11px] font-mono text-[#78716C] dark:text-slate-400 uppercase tracking-wider">
            Terintegrasi dengan Otoritas Publik & Laboratorium Riset
          </p>
        </div>

        {/* Clean Monochrome Slate Logo Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {INSTITUTIONAL_PARTNERS.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.id}
                className="group relative flex flex-col justify-between rounded-xl p-3 opacity-65 hover:opacity-100 hover:bg-white/80 dark:hover:bg-[#0E1420]/80 transition-all duration-150 cursor-default border border-transparent hover:border-[#E5E0D8] dark:hover:border-[#1E2638]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EFEAE2] text-[#141824] dark:bg-slate-800 dark:text-slate-300 group-hover:bg-[#181818] group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-950 transition-colors duration-150">
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="font-mono text-[9px] font-semibold text-[#78716C] dark:text-slate-400 tracking-wider">
                      {partner.badge}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-[#141824] dark:text-[#F8FAFC] leading-snug">
                      {partner.name}
                    </h3>
                    <p className="text-[10px] text-[#78716C] dark:text-[#94A3B8] leading-tight">
                      {partner.standard}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
