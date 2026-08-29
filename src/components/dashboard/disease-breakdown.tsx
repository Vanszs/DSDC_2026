"use client";

import React from "react";
import { DistrictSummaryDTO } from "@/lib/queries";
import { Bug, Droplet, Wind, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiseaseBreakdownProps {
  district?: DistrictSummaryDTO | null;
  className?: string;
}

export const DiseaseBreakdown: React.FC<DiseaseBreakdownProps> = ({
  district,
  className,
}) => {
  if (!district) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center", className)}>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 mb-2">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Pilih Kecamatan</h4>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
          Data analitik bioklimatik Kota Semarang sedang diproses.
        </p>
      </div>
    );
  }

  const diseases = [
    {
      id: "dengue",
      name: "Demam Berdarah Dengue (DBD)",
      score: district.dengueRisk,
      icon: Bug,
      model: "Suhu Optimum Nyamuk & Siklus Hujan 14 Hari",
      riskText: district.dengueRisk >= 70 ? "Kritis" : district.dengueRisk >= 40 ? "Waspada" : "Rendah",
      colorClass:
        district.dengueRisk >= 70
          ? "bg-red-500 text-red-500"
          : district.dengueRisk >= 40
          ? "bg-amber-500 text-amber-500"
          : "bg-emerald-500 text-emerald-500",
    },
    {
      id: "ispa",
      name: "Infeksi Saluran Pernapasan Akut (ISPA)",
      score: district.ispaRisk,
      icon: Wind,
      model: "Polusi Partikel Debu PM2.5 & Angin Tenang",
      riskText: district.ispaRisk >= 70 ? "Kritis" : district.ispaRisk >= 40 ? "Waspada" : "Rendah",
      colorClass:
        district.ispaRisk >= 70
          ? "bg-red-500 text-red-500"
          : district.ispaRisk >= 40
          ? "bg-amber-500 text-amber-500"
          : "bg-emerald-500 text-emerald-500",
    },
  ];

  return (
    <div className={cn("rounded-md border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0B0F19] space-y-3.5", className)}>
      {/* Header Wilayah */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {district.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            {district.kemendagriCode} &bull; {district.typology}
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          Skor Bahaya {district.compositeScore} / 100
        </span>
      </div>

      {/* Mikroklimat Aktual */}
      <div className="grid grid-cols-3 gap-2 rounded-sm bg-slate-50 p-2.5 text-center dark:bg-[#080C14] border border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-500 block">Suhu Udara</span>
          <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
            {district.temperatureAvg}°C
          </span>
        </div>
        <div className="border-x border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 block">Presipitasi</span>
          <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
            {district.rainfallMm} mm
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">PM2.5</span>
          <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
            {district.pm25} µg/m³
          </span>
        </div>
      </div>

      {/* 3 Indikator Risiko Penyakit */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
          Estimasi Risiko Beban Penyakit
        </span>
        {diseases.map((d) => {
          const Icon = d.icon;
          return (
            <div
              key={d.id}
              className="rounded-sm border border-slate-200/70 bg-white p-3 dark:border-slate-800 dark:bg-[#080C14] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {d.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {d.model}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-slate-500">
                    {d.riskText}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {d.score}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", d.colorClass.split(" ")[0])}
                  style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rekomendasi Kebijakan Tindakan */}
      <div className="rounded-sm border border-emerald-200/80 bg-emerald-50/50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-emerald-900 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Rekomendasi Intervensi Dinas Kesehatan:</span>
        </div>
        <p className="text-[11.5px] text-emerald-950/90 dark:text-emerald-200/90 pl-5 leading-relaxed">
          {district.recommendation}
        </p>
      </div>
    </div>
  );
};
