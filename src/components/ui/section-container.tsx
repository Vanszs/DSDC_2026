import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full relative transition-colors", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-8 sm:py-12",
      default: "py-14 sm:py-20 lg:py-24",
      lg: "py-20 sm:py-28 lg:py-32",
      hero: "pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24",
    },
    divider: {
      none: "",
      top: "border-t border-[#E5E0D8] dark:border-[#1E2638]",
      bottom: "border-b border-[#E5E0D8] dark:border-[#1E2638]",
      both: "border-y border-[#E5E0D8] dark:border-[#1E2638]",
    },
  },
  defaultVariants: {
    spacing: "default",
    divider: "none",
  },
});

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      default: "max-w-7xl",
      wide: "max-w-[1400px]",
      narrow: "max-w-5xl",
      compact: "max-w-3xl",
      full: "max-w-full",
    },
    gutter: {
      default: "px-4 sm:px-6 lg:px-8",
      spacious: "px-6 sm:px-8 lg:px-12",
      compact: "px-4 sm:px-6",
      none: "px-0",
    },
  },
  defaultVariants: {
    size: "default",
    gutter: "spacious",
  },
});

export interface SectionContainerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants>,
    VariantProps<typeof containerVariants> {
  as?: "section" | "div" | "main" | "article" | "header" | "footer";
  containerClassName?: string;
}

export const SectionContainer = React.forwardRef<
  HTMLElement,
  SectionContainerProps
>(
  (
    {
      as: Component = "section",
      className,
      containerClassName,
      spacing,
      divider,
      size,
      gutter,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(sectionVariants({ spacing, divider }), className)}
        {...props}
      >
        <div
          className={cn(
            containerVariants({ size, gutter }),
            containerClassName
          )}
        >
          {children}
        </div>
      </Component>
    );
  }
);

SectionContainer.displayName = "SectionContainer";

export { sectionVariants, containerVariants };
