"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionContainer } from "@/components/ui/section-container";

export interface StickyFooterProps {
  className?: string;
}

export function StickyFooter({ className }: StickyFooterProps) {
  return (
    <footer
      role="contentinfo"
      aria-label="Footer Resmi Sentry"
      className={className}
    >
      <div className="w-full bg-primary text-background overflow-hidden">
        <SectionContainer
          as="div"
          spacing="none"
          size="full"
          gutter="spacious"
          className="pt-10 sm:pt-14 pb-0"
        >
          {/* Top Concise Row: Brand + Clean Nav Links */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1.5 backdrop-blur-xs shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Sentry Logo"
                  width={32}
                  height={36}
                  className="h-full w-auto object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Sentry
                </span>
                <span className="text-xs text-[#9E978C]">
                  Early Warning Platform for Climate-Driven Epidemics
                </span>
              </div>
            </div>

            {/* Right: Concise Horizontal Links matching sections */}
            <nav
              aria-label="Navigasi Footer"
              className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs sm:text-sm text-[#B3ACA0]"
            >
              <a
                href="/#main-content"
                className="hover:text-white transition-colors"
              >
                Beranda
              </a>
              <a
                href="/#tentang-sentry"
                className="hover:text-white transition-colors"
              >
                Tentang
              </a>
              <a
                href="/#tantangan"
                className="hover:text-white transition-colors"
              >
                Tantangan
              </a>
              <a
                href="/#alur-kerja"
                className="hover:text-white transition-colors"
              >
                Alur Kerja
              </a>
              <Link
                href="/login"
                className="hover:text-white text-accent font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>Mulai Analisa</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-6 flex items-center justify-between text-xs text-[#8C8477]">
            <p>
              © 2026 Sentry. Hak Cipta Dilindungi.
            </p>
          </div>
        </SectionContainer>

        {/* Full 1-Width Sunken Massive Display Text "Sentry" */}
        <div className="w-full max-w-full overflow-hidden select-none pointer-events-none flex items-end justify-center pt-2 sm:pt-4">
          <span className="w-full text-center block font-bold text-[23vw] leading-[0.72] tracking-[-0.05em] text-white/5 translate-y-[24%] sm:translate-y-[26%] transition-colors">
            Sentry
          </span>
        </div>
      </div>
    </footer>
  );
}

export default StickyFooter;
