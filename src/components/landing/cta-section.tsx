"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";
import { cn } from "@/lib/utils";

export interface CtaSectionProps {
  id?: string;
  className?: string;
}

export function CtaSection({ id = "cta", className }: CtaSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full bg-background text-foreground py-28 sm:py-36 lg:py-44 transition-colors duration-200 overflow-hidden",
        className
      )}
    >
      {/* Vibrant & Rich Ambient Spotlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] sm:w-[920px] lg:w-[1150px] h-[460px] bg-[radial-gradient(ellipse_65%_65%_at_50%_50%,rgba(245,158,11,0.18)_0%,rgba(217,119,6,0.10)_45%,transparent_75%)] dark:bg-[radial-gradient(ellipse_65%_65%_at_50%_50%,rgba(16,185,129,0.24)_0%,rgba(5,150,105,0.12)_45%,transparent_75%)] pointer-events-none blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[280px] bg-[radial-gradient(ellipse_55%_65%_at_50%_50%,rgba(251,191,36,0.22)_0%,rgba(217,119,6,0.12)_50%,transparent_75%)] dark:bg-[radial-gradient(ellipse_55%_65%_at_50%_50%,rgba(52,211,153,0.26)_0%,rgba(16,185,129,0.14)_50%,transparent_75%)] pointer-events-none blur-xl" />

      <SectionContainer
        as="div"
        spacing="none"
        size="full"
        gutter="spacious"
        className="w-full relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-text-secondary uppercase">
            <span>( MULAI SEKARANG )</span>
          </div>

          {/* Clean Call-to-Action Headline */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-medium tracking-[-0.035em] text-foreground leading-[1.14] max-w-3xl mx-auto">
            Mulai langkah preventif kesehatan kota Anda hari ini
          </h2>

          {/* 1 Polished Action Button with Spacious Gap */}
          <div className="flex items-center justify-center pt-4 sm:pt-6">
            <Link
              href="/login"
              className="h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-primary hover:bg-black dark:hover:bg-white/90 text-background text-sm sm:text-base font-semibold flex items-center gap-2.5 transition-all shadow-md active:scale-[0.98]"
            >
              <span>Mulai Analisa</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

export default CtaSection;
