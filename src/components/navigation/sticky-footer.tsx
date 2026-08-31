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
          className="pt-8 sm:pt-12 md:pt-14 pb-0"
        >
          {/* Top Row: Brand + Responsive Navigation Links */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 pb-6 sm:pb-8 border-b border-white/10">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 p-1.5 backdrop-blur-xs shrink-0">
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
                <span className="text-xs text-[#9E978C] max-w-xs sm:max-w-md leading-tight sm:leading-normal">
                  Early Warning Platform for Climate-Driven Epidemics
                </span>
              </div>
            </div>

            {/* Right: Responsive Navigation Links */}
            <nav
              aria-label="Navigasi Footer"
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-x-7 sm:gap-y-3 text-xs sm:text-sm text-[#B3ACA0]"
            >
              <a
                href="/#main-content"
                className="hover:text-white transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
              >
                Beranda
              </a>
              <a
                href="/#tentang-sentry"
                className="hover:text-white transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
              >
                Tentang
              </a>
              <a
                href="/#tantangan"
                className="hover:text-white transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
              >
                Tantangan
              </a>
              <a
                href="/#alur-kerja"
                className="hover:text-white transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
              >
                Alur Kerja
              </a>
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition-colors py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
              >
                <span>Mulai Analisa</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </nav>
          </div>

          {/* Bottom Row: Copyright & Platform Metadata */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-[11px] sm:text-xs text-[#8C8477]">
            <p>© 2026 Sentry. Hak Cipta Dilindungi.</p>
            <p className="text-[#8C8477]/80">
              Kota Semarang • DSDC 2026
            </p>
          </div>
        </SectionContainer>

        {/* Full-Width Sunken Giant Display Watermark */}
        <div className="w-full max-w-full overflow-hidden select-none pointer-events-none flex items-end justify-center pt-2 sm:pt-4">
          <span className="w-full text-center block font-black text-[22vw] leading-[0.7] tracking-[-0.04em] text-white/5 translate-y-[22%] sm:translate-y-[25%] transition-transform">
            Sentry
          </span>
        </div>
      </div>
    </footer>
  );
}

export default StickyFooter;
