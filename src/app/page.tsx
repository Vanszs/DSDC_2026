"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { GlobalNavbar } from "@/components/navigation/global-navbar";
import { SectionContainer } from "@/components/ui/section-container";
import { StickyFooter } from "@/components/navigation/sticky-footer";
import { AboutSection } from "@/components/landing/about-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Main Sliding Content Layer (100% Opaque, Lifts above footer upon scrolling) */}
      <div
        className="relative z-10 min-h-screen w-full flex flex-col justify-between bg-background text-foreground shadow-2xl overflow-x-clip"
      >
        {/* Luminous Top-Center Ambient Spotlight Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] lg:w-[1100px] h-[400px] bg-[radial-gradient(ellipse_70%_75%_at_50%_0%,rgba(217,119,6,0.22)_0%,rgba(245,158,11,0.12)_45%,transparent_75%)] dark:bg-[radial-gradient(ellipse_70%_75%_at_50%_0%,rgba(16,185,129,0.28)_0%,rgba(5,150,105,0.14)_45%,transparent_75%)] pointer-events-none blur-2xl" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[260px] bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(217,119,6,0.28)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(16,185,129,0.32)_0%,transparent_70%)] pointer-events-none blur-xl" />

        {/* Global Top Navbar */}
        <GlobalNavbar />

        {/* Hero Section Container */}
        <SectionContainer
          as="main"
          id="main-content"
          role="main"
          spacing="hero"
          size="full"
          gutter="spacious"
          className="flex-1 flex flex-col items-center justify-center text-center relative z-10 pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-8"
        >
          {/* Hero Headline Text matching Swiss Typographic Scale - Strictly 2 Lines with Entrance Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.08,
            }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] 2xl:text-[62px] font-medium sm:font-semibold tracking-[-0.03em] text-foreground leading-[1.18] sm:leading-[1.12] lg:leading-[1.08] max-w-5xl mx-auto mt-4 sm:mt-6 lg:mt-8 xl:mt-10"
          >
            Satu platform untuk memantau <br className="hidden sm:inline" />
            dan memahami risiko kesehatan
          </motion.h1>

          {/* 2 Buttons Row - Borderless Swiss Style with Palette Tokens & Staggered Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.22,
            }}
            className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 sm:mt-10"
          >
            <Link
              href="/login"
              className="h-11 sm:h-12 px-7 sm:px-8 rounded-xl bg-primary hover:bg-black dark:hover:bg-white/90 text-background text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Mulai Analisa</span>
            </Link>

            <Link
              href="/#alur-kerja"
              className="h-11 sm:h-12 px-7 sm:px-8 rounded-xl bg-primary-light hover:bg-border text-foreground text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Jelajahi Fitur</span>
            </Link>
          </motion.div>

          {/* Platform Image Showcase - Taller on Mobile with Staggered Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.36,
            }}
            className="w-full max-w-full mx-auto mt-12 sm:mt-16 px-2 sm:px-6 lg:px-10 relative"
          >
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]">
              <Image
                src="/current-drawer-test.png"
                alt="Sentry Cockpit Platform Interface"
                width={1920}
                height={1080}
                priority
                className="w-full h-[320px] sm:h-[440px] md:h-[560px] lg:h-auto object-cover object-top rounded-xl shadow-xl"
              />
              {/* Bottom seamless fade overlay into var(--background) */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 sm:h-48 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, transparent, var(--background))",
                }}
              />
            </div>
          </motion.div>
        </SectionContainer>

        {/* Modular About Section */}
        <AboutSection />

        {/* Modular Problem Section */}
        <ProblemSection />

        {/* Modular Solution Section */}
        <SolutionSection />

        {/* Modular CTA Section */}
        <CtaSection />
      </div>

      {/* Sticky Curtain Reveal Footer */}
      <div className="sticky bottom-0 z-0 w-full">
        <StickyFooter />
      </div>
    </div>
  );
}

