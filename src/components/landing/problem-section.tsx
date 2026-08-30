"use client";

import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

export interface ProblemSectionProps {
  id?: string;
  className?: string;
}

interface ProblemCardData {
  id: string;
  number: string;
  category: string;
  badgeColor: string;
  numberColor: string;
  cardBg: string;
  titleColor: string;
  problemColor: string;
  title: string;
  problem: string;
}

const PROBLEM_CARDS: ProblemCardData[] = [
  {
    id: "reactive-delay",
    number: "01",
    category: "SURVEILANS REAKTIF",
    cardBg: "bg-[#261A12]/90 hover:bg-[#302117] border border-[#B45309]/35 hover:border-[#F59E0B]/60 shadow-[0_4px_24px_rgba(217,119,6,0.06)]",
    badgeColor: "bg-[#D97706]/20 text-[#FBBF24] border border-[#D97706]/40",
    numberColor: "text-[#FBBF24]/60",
    titleColor: "text-[#FEF3C7]",
    problemColor: "text-[#E7E5E4]",
    title: "Keterlambatan Sinyal Epidemiologi Klinis",
    problem:
      "Sistem pelaporan rumah sakit konvensional baru mencatat kasus setelah pasien tiba di fasilitas kesehatan, menciptakan celah waktu kritis ketika transmisi patogen sebenarnya telah meluas tanpa terdeteksi di masyarakat.",
  },
  {
    id: "climate-disconnect",
    number: "02",
    category: "DINAMIKA METEOROLOGI",
    cardBg: "bg-[#10241B]/90 hover:bg-[#152E23] border border-[#059669]/35 hover:border-[#10B981]/60 shadow-[0_4px_24px_rgba(16,185,129,0.06)]",
    badgeColor: "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40",
    numberColor: "text-[#34D399]/60",
    titleColor: "text-[#D1FAE5]",
    problemColor: "text-[#E5E7EB]",
    title: "Anomali Iklim yang Terisolasi dari Sistem Medis",
    problem:
      "Fluktuasi suhu permukaan, curah hujan ekstrem, dan kelembapan udara mikro yang memicu percepatan masa inkubasi nyamuk serta iritasi saluran pernapasan tidak terintegrasi ke dalam sistem kesiapsiagaan kesehatan publik.",
  },
  {
    id: "spatial-inequity",
    number: "03",
    category: "INTERVENSI WILAYAH",
    cardBg: "bg-[#131F35]/90 hover:bg-[#1A2946] border border-[#2563EB]/35 hover:border-[#60A5FA]/60 shadow-[0_4px_24px_rgba(59,130,246,0.06)]",
    badgeColor: "bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40",
    numberColor: "text-[#60A5FA]/60",
    titleColor: "text-[#DBEAFE]",
    problemColor: "text-[#E2E8F0]",
    title: "Alokasi Mitigasi yang Terlambat Menjangkau Titik Kritis",
    problem:
      "Ketiadaan estimasi risiko spasial mikro menyebabkan pengerahan tenaga medis, tindakan pencegahan lapangan, dan distribusi logistik obat sering kali baru tiba setelah suatu wilayah memasuki fase darurat wabah.",
  },
];

export function ProblemSection({
  id = "tantangan",
  className,
}: ProblemSectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full bg-primary text-background py-28 sm:py-36 lg:py-44 ${className ?? ""}`}
    >
      <SectionContainer
        as="div"
        spacing="none"
        size="full"
        gutter="spacious"
        className="w-full relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Sticky Title & 1-Sentence Question */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-text-secondary opacity-80 uppercase">
              <span>( PROBLEM )</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.03em] text-background leading-[1.18]">
              Mengapa surveilans wabah konvensional terlambat?
            </h2>
          </div>

          {/* Right Column: Distinct, Eye-Friendly Colorful Cards */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {PROBLEM_CARDS.map((card) => (
              <div
                key={card.id}
                className={`p-7 sm:p-9 rounded-2xl ${card.cardBg} transition-all duration-300 space-y-5 shadow-sm`}
              >
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase ${card.badgeColor}`}
                  >
                    {card.category}
                  </span>
                  <span className={`font-mono text-sm font-semibold ${card.numberColor}`}>
                    {card.number}
                  </span>
                </div>

                {/* Main Problem Headline & Explanation */}
                <div className="space-y-3">
                  <h3 className={`text-xl sm:text-2xl font-medium tracking-tight ${card.titleColor}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${card.problemColor}`}>
                    {card.problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export default ProblemSection;
