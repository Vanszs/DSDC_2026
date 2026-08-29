"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { format, subDays, addDays, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TimelineSliderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  maxPastDays?: number;
  maxFutureDays?: number;
  className?: string;
}

export type PlaybackSpeed = 1 | 2;

export interface HorizonStepInfo {
  index: number;
  dateStr: string;
  offsetDays: number;
  label: string;
  horizonType: "historical" | "now" | "forecast";
  horizonPhase: string;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  selectedDate,
  onDateChange,
  maxPastDays = 28,
  maxFutureDays = 30,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => new Date(), []);

  const dateSteps = useMemo<HorizonStepInfo[]>(() => {
    const steps: HorizonStepInfo[] = [];
    let idx = 0;

    for (let offset = -maxPastDays; offset <= maxFutureDays; offset++) {
      const d = offset < 0 ? subDays(today, Math.abs(offset)) : addDays(today, offset);
      const dateStr = format(d, "yyyy-MM-dd");

      let horizonType: "historical" | "now" | "forecast" = "now";
      let label = "Hari Ini";
      let horizonPhase = "Status Terkini (H-0)";

      if (offset < 0) {
        horizonType = "historical";
        const daysAgo = Math.abs(offset);
        label = `H-${daysAgo}`;
        horizonPhase = `Training Historis (H-${daysAgo})`;
      } else if (offset > 0) {
        horizonType = "forecast";
        label = `H+${offset}`;
        horizonPhase = `Proyeksi Masa Depan (H+${offset})`;
      }

      steps.push({
        index: idx++,
        dateStr,
        offsetDays: offset,
        label,
        horizonType,
        horizonPhase,
      });
    }
    return steps;
  }, [maxPastDays, maxFutureDays, today]);

  const dateList = useMemo(() => dateSteps.map((s) => s.dateStr), [dateSteps]);
  const currentIndex = dateList.indexOf(selectedDate);
  const nowIndex = dateSteps.findIndex((s) => s.offsetDays === 0);
  const safeIndex = currentIndex === -1 ? (nowIndex !== -1 ? nowIndex : 0) : currentIndex;
  const currentStep = dateSteps[safeIndex] ?? dateSteps[nowIndex] ?? dateSteps[0];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const nextIndex = (safeIndex + 1) % dateList.length;
        onDateChange(dateList[nextIndex]);
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, safeIndex, dateList, onDateChange]);

  const handlePrev = useCallback(() => {
    if (safeIndex > 0) {
      onDateChange(dateList[safeIndex - 1]);
    }
  }, [safeIndex, dateList, onDateChange]);

  const handleNext = useCallback(() => {
    if (safeIndex < dateList.length - 1) {
      onDateChange(dateList[safeIndex + 1]);
    }
  }, [safeIndex, dateList, onDateChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (idx >= 0 && idx < dateList.length) {
      onDateChange(dateList[idx]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "Home") {
      e.preventDefault();
      onDateChange(dateList[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      onDateChange(dateList[dateList.length - 1]);
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const formattedDate = useMemo(() => {
    try {
      const parsed = parseISO(selectedDate);
      if (isValid(parsed)) {
        return format(parsed, "dd MMMM yyyy", { locale: id });
      }
      return format(new Date(selectedDate), "dd MMMM yyyy");
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const progressPercent =
    dateList.length > 1 ? (safeIndex / (dateList.length - 1)) * 100 : 50;

  const quickPresets = [
    { label: "W-4 (H-28)", offset: -28 },
    { label: "W-2 (H-14)", offset: -14 },
    { label: "W-1 (H-7)", offset: -7 },
    { label: "Hari Ini", offset: 0 },
    { label: "W+1 (H+7)", offset: 7 },
    { label: "W+2 (H+14)", offset: 14 },
    { label: "W+4 (H+30)", offset: 30 },
  ];

  return (
    <div
      role="region"
      aria-label="Panel Pengontrol Waktu dan Prediksi Epidemiologi"
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-[#0B0F19] select-none text-xs space-y-2.5",
        className
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 font-mono uppercase tracking-tight">
              Timeframe Epidemiologi
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-2">
              {currentStep.horizonPhase}
            </span>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {formattedDate}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold ml-2 px-2 py-0.5 rounded-md",
              currentStep.offsetDays === 0
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : currentStep.offsetDays > 0
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {currentStep.offsetDays === 0
              ? "Hari Ini"
              : currentStep.offsetDays > 0
              ? `H+${currentStep.offsetDays}`
              : `H-${Math.abs(currentStep.offsetDays)}`}
          </span>
        </div>
      </div>

      {/* Slider & Presets */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 active:scale-95 transition-transform shrink-0",
            isPlaying
              ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
              : "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
          )}
          title={isPlaying ? "Jeda Simulasi" : "Putar Simulasi"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Scrubber Range */}
        <div className="relative flex-1 py-1">
          <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-100",
                currentStep.horizonType === "forecast"
                  ? "bg-indigo-500"
                  : currentStep.horizonType === "historical"
                  ? "bg-slate-500"
                  : "bg-emerald-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <input
            ref={sliderRef}
            type="range"
            min={0}
            max={dateList.length - 1}
            value={safeIndex}
            onChange={handleSliderChange}
            aria-label="Penggeser Waktu"
            className="absolute top-0 left-0 z-10 h-4 w-full cursor-pointer opacity-0 focus-visible:opacity-100 rounded-lg"
          />

          <div className="mt-1 flex w-full justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500 px-0.5">
            <span>W-4 (H-28)</span>
            <span>W-2 (H-14)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Hari Ini</span>
            <span>W+2 (H+14)</span>
            <span>W+4 (H+30)</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={safeIndex === dateList.length - 1}
          className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center justify-between gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-mono text-[9.5px]">
        <span className="text-slate-400 font-semibold">Lompat Horizon:</span>
        <div className="flex flex-wrap items-center gap-1">
          {quickPresets.map((p) => {
            const target = dateSteps.find((s) => s.offsetDays === p.offset);
            const isCurrent = target && selectedDate === target.dateStr;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => target && onDateChange(target.dateStr)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors border",
                  isCurrent
                    ? p.offset === 0
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : p.offset > 0
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-900 text-white border-slate-900 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-[#080C14] dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
