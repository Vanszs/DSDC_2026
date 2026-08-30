"use client";

import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import TextHighlighter from "@/components/ui/text-highlighter";

export interface AboutSectionProps {
  id?: string;
  className?: string;
}

export function AboutSection({
  id = "tentang-sentry",
  className,
}: AboutSectionProps) {
  return (
    <SectionContainer
      as="section"
      id={id}
      spacing="none"
      size="full"
      gutter="spacious"
      className={className ?? "relative z-10 py-28 sm:py-36 lg:py-48 overflow-hidden"}
    >
      {/* Large Grid Decorative Background (Fading from Bottom-Right to Top-Left) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 85% at 100% 100%, black 20%, rgba(0,0,0,0.5) 48%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at 100% 100%, black 20%, rgba(0,0,0,0.5) 48%, transparent 80%)",
        }}
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,24,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,24,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,248,245,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,248,245,0.08)_1px,transparent_1px)] bg-[size:72px_72px] sm:bg-[size:88px_88px] bg-[position:right_bottom]"
        />
        {/* Soft bottom-right ambient accent glow */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[radial-gradient(circle_at_100%_100%,rgba(217,119,6,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.08),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Authentic Clean Swiss Label */}
        <div className="lg:col-span-3 xl:col-span-3">
          <span className="text-xs font-bold tracking-[0.25em] text-foreground uppercase">
            ( ABOUT )
          </span>
        </div>

        {/* Right Column: Enriched Human Editorial Narrative with Palette TextHighlighter */}
        <div className="lg:col-span-9 xl:col-span-9 max-w-5xl">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-normal tracking-[-0.02em] text-foreground leading-[1.36] sm:leading-[1.32] lg:leading-[1.28]">
            Sentry adalah{" "}
            <TextHighlighter
              highlightColor="var(--highlight-bg)"
              className="font-semibold text-foreground px-2 py-0.5 rounded-md"
            >
              platform peringatan dini epidemiologi prediktif
            </TextHighlighter>{" "}
            yang menjembatani anomali iklim dan dinamika kesehatan publik. Dengan memadukan model lag non-linear dan aliran data meteorologi beresolusi tinggi, platform ini memproyeksikan risiko lonjakan demam berdarah dan infeksi saluran pernapasan hingga 1 bulan ke depan untuk menggerakkan mitigasi medis terarah di seluruh wilayah Indonesia sebelum krisis kesehatan berkembang menjadi wabah.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}

export default AboutSection;
