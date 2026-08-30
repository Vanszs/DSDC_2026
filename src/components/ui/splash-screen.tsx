"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Quote } from "lucide-react";

export interface SplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function SplashScreen({ onComplete, forceShow = false }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    let hasSeen = false;
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        hasSeen = window.sessionStorage.getItem("hasSeenSplashScreen") === "true";
      }
    } catch {}

    if (hasSeen && !forceShow) {
      setShouldRender(false);
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    // Auto dismiss after user reads the quote (~4.2s)
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 4200);

    return () => {
      clearTimeout(dismissTimer);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [onComplete, forceShow]);

  const handleExitComplete = () => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.setItem("hasSeenSplashScreen", "true");
      } catch {}
    }
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    setShouldRender(false);
    if (onComplete) onComplete();
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080C14] text-[#F8F9FC] px-6 select-none pointer-events-auto"
          style={{
            backgroundColor: "#080C14",
          }}
        >
          {/* Centered Content: Logo directly above quote */}
          <div className="flex flex-col max-w-4xl px-6 sm:px-12 w-full relative z-10">
            {/* Logo directly above quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
              className="mb-10 sm:mb-14 flex items-center justify-center"
            >
              <Image
                src="/logo-white.svg"
                alt="Sentry Logo"
                width={144}
                height={144}
                priority
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </motion.div>

            {/* Quote Icon Symbol - Strictly Left Aligned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="w-full flex items-center justify-start mb-4 sm:mb-5"
            >
              <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400 opacity-85 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            </motion.div>

            <blockquote className="font-sans text-xl sm:text-3xl md:text-4xl text-[#FAF8F5] font-light leading-relaxed sm:leading-[1.5] tracking-tight text-left drop-shadow-md flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3 gap-y-1 sm:gap-y-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeInOut" }}
                className="inline-block"
              >
                The world cannot be understood
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
                className="inline-block text-[#EFEAE2]"
              >
                without numbers.
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.15, ease: "easeInOut" }}
                className="inline-block"
              >
                And it cannot be understood
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.55, ease: "easeInOut" }}
                className="inline-block text-emerald-400 font-normal"
              >
                by numbers alone.
              </motion.span>
            </blockquote>

            {/* Author - Right Aligned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 2.1, ease: "easeInOut" }}
              className="w-full flex flex-col items-end text-right mt-8 sm:mt-10"
            >
              <cite className="font-sans text-xs sm:text-sm md:text-base text-emerald-400 tracking-[0.16em] uppercase not-italic font-semibold drop-shadow-sm">
                — Hans Rosling
              </cite>
              <span className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-[#9E988F] tracking-wider font-light capitalize">
                physician, academic, and public speaker
              </span>
            </motion.div>
          </div>

          {/* Bottom Curved Wave Transition - enters as splash screen slides up to -100% */}
          <div className="absolute top-full left-0 w-full h-[120px] sm:h-[180px] overflow-hidden pointer-events-none -mt-1">
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="w-full h-full fill-[#080C14]"
            >
              <path d="M0,0 L1440,0 L1440,60 Q720,320 0,60 Z" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
