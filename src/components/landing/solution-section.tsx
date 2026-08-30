"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/section-container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface SolutionSectionProps {
  id?: string;
  className?: string;
}

interface StepItem {
  id: string;
  stepNumber: string;
  stepName: string;
  diagramSvg: string;
}

const STEP_DURATION_MS = 6500; // 6.5 detik per slide

const SOLUTION_STEPS: StepItem[] = [
  {
    id: "step-1",
    stepNumber: "01",
    stepName: "Mendapatkan Data",
    diagramSvg: "/diagrams/step-1-ingestion.svg",
  },
  {
    id: "step-2",
    stepNumber: "02",
    stepName: "Formulasi Rumus",
    diagramSvg: "/diagrams/step-2-preprocessing.svg",
  },
  {
    id: "step-3",
    stepNumber: "03",
    stepName: "Model AI L2 Ridge",
    diagramSvg: "/diagrams/step-3-dlnm-core.svg",
  },
  {
    id: "step-4",
    stepNumber: "04",
    stepName: "Akar Penyebab",
    diagramSvg: "/diagrams/step-4-risk-threshold.svg",
  },
  {
    id: "step-5",
    stepNumber: "05",
    stepName: "Solusi Lapangan",
    diagramSvg: "/diagrams/step-5-orchestration.svg",
  },
];

export function SolutionSection({
  id = "alur-kerja",
  className,
}: SolutionSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync index with carousel api
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
      setProgress(0);
    });
  }, [api]);

  // Instagram Stories style infinite timer
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalStep = 50; // update every 50ms
    const progressIncrement = (intervalStep / STEP_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (currentIndex + 1) % SOLUTION_STEPS.length;
          setCurrentIndex(nextIndex);
          api?.scrollTo(nextIndex);
          return 0;
        }
        return Math.min(100, prev + progressIncrement);
      });
    }, intervalStep);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, api]);

  const handleStepClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    api?.scrollTo(index);
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full bg-background text-foreground py-28 sm:py-36 lg:py-44 transition-colors duration-200",
        className
      )}
    >
      <SectionContainer
        as="div"
        spacing="none"
        size="full"
        gutter="spacious"
        className="w-full relative z-10"
      >
        {/* Section Header with wide 2-line balanced title */}
        <div className="w-full max-w-none space-y-4 sm:space-y-5 mb-14 sm:mb-20 lg:mb-24">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-text-secondary uppercase">
            <span>( HOW IT WORKS )</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-medium tracking-[-0.03em] text-foreground leading-[1.2] w-full max-w-none">
            Transformasi data iklim 30 tahun
            <br className="hidden sm:inline" />{" "}
            menjadi aksi pencegahan wabah terukur
          </h2>
        </div>

        {/* Seamless Open Story Layout (Full Image Slides) */}
        <div
          className="relative w-full space-y-6 sm:space-y-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Instagram-Style Segmented Progress Indicator */}
          <div className="w-full">
            <div className="grid grid-cols-5 gap-2 sm:gap-3.5">
              {SOLUTION_STEPS.map((step, idx) => {
                let barWidth = 0;
                if (idx < currentIndex) {
                  barWidth = 100;
                } else if (idx === currentIndex) {
                  barWidth = progress;
                } else {
                  barWidth = 0;
                }

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className="group flex flex-col gap-2 text-left outline-none py-1 cursor-pointer"
                    aria-label={`Buka ${step.stepName}`}
                  >
                    {/* Progress Track */}
                    <div className="w-full h-1.5 sm:h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          idx === currentIndex
                            ? "bg-primary transition-[width] duration-75 ease-linear"
                            : idx < currentIndex
                            ? "bg-primary/70 transition-none"
                            : "bg-transparent transition-none"
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Step Label (Side-by-side) */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-semibold text-text-secondary group-hover:text-foreground transition-colors">
                      <span className="font-bold shrink-0">{step.stepNumber}</span>
                      <span className="hidden sm:inline truncate text-[11px] font-sans font-medium">
                        {step.stepName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carousel with Full-Image Slides (No swiping, Infinite Loop, No text explanations) */}
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              watchDrag: false, // Disables touch & mouse drag swiping
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {SOLUTION_STEPS.map((step) => {
                return (
                  <CarouselItem key={step.id} className="pl-0 basis-full">
                    <div className="w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.diagramSvg}
                        alt={step.stepName}
                        className="w-full h-auto block select-none"
                        loading="eager"
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </SectionContainer>
    </section>
  );
}

export default SolutionSection;
