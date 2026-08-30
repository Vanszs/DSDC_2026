"use client";

import {
  ElementType,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, Transition, useInView, UseInViewOptions } from "motion/react";
import { cn } from "@/lib/utils";

type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt";

type TextHighlighterProps = {
  children: React.ReactNode;
  as?: ElementType;
  triggerType?: "hover" | "ref" | "inView" | "auto";
  transition?: Transition;
  useInViewOptions?: UseInViewOptions;
  className?: string;
  highlightColor?: string;
  direction?: HighlightDirection;
} & React.HTMLAttributes<HTMLElement>;

export type TextHighlighterRef = {
  animate: (direction?: HighlightDirection) => void;
  reset: () => void;
};

export const TextHighlighter = forwardRef<
  TextHighlighterRef,
  TextHighlighterProps
>(
  (
    {
      children,
      as = "span",
      triggerType = "inView",
      transition = { type: "spring", duration: 1, delay: 0, bounce: 0 },
      useInViewOptions = {
        once: true,
        initial: false,
        amount: 0.3,
        margin: "-100px 0px -100px 0px",
      },
      className,
      highlightColor = "var(--highlight-bg, rgba(245, 158, 11, 0.28))",
      direction = "ltr",
      ...props
    },
    ref
  ) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentDirection, setCurrentDirection] =
      useState<HighlightDirection>(direction);

    useEffect(() => {
      setCurrentDirection(direction);
    }, [direction]);

    const isInView =
      triggerType === "inView"
        ? useInView(componentRef, useInViewOptions)
        : false;

    useImperativeHandle(ref, () => ({
      animate: (animationDirection?: HighlightDirection) => {
        if (animationDirection) {
          setCurrentDirection(animationDirection);
        }
        setIsAnimating(true);
      },
      reset: () => setIsAnimating(false),
    }));

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : triggerType === "auto"
              ? true
              : false;

    const ElementTag = as || "span";

    const getBackgroundSize = (animated: boolean) => {
      switch (currentDirection) {
        case "ltr":
          return animated ? "100% 100%" : "0% 100%";
        case "rtl":
          return animated ? "100% 100%" : "0% 100%";
        case "ttb":
          return animated ? "100% 100%" : "100% 0%";
        case "btt":
          return animated ? "100% 100%" : "100% 0%";
        default:
          return animated ? "100% 100%" : "0% 100%";
      }
    };

    const getBackgroundPosition = () => {
      switch (currentDirection) {
        case "ltr":
          return "0% 0%";
        case "rtl":
          return "100% 0%";
        case "ttb":
          return "0% 0%";
        case "btt":
          return "0% 100%";
        default:
          return "0% 0%";
      }
    };

    const animatedSize = useMemo(() => getBackgroundSize(shouldAnimate), [shouldAnimate, currentDirection]);
    const initialSize = useMemo(() => getBackgroundSize(false), [currentDirection]);
    const backgroundPosition = useMemo(() => getBackgroundPosition(), [currentDirection]);

    const highlightStyle = {
      backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: backgroundPosition,
      backgroundSize: animatedSize,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    } as React.CSSProperties;

    return (
      <ElementTag
        ref={componentRef}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
        {...props}
      >
        <motion.span
          className={cn("inline", className)}
          style={highlightStyle}
          animate={{
            backgroundSize: animatedSize,
          }}
          initial={{
            backgroundSize: initialSize,
          }}
          transition={transition}
        >
          {children}
        </motion.span>
      </ElementTag>
    );
  }
);

TextHighlighter.displayName = "TextHighlighter";

export default TextHighlighter;