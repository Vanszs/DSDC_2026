import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 active-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default:
          "bg-[#181818] text-white shadow-sm hover:bg-black active:bg-black dark:bg-[#FAF8F5] dark:text-[#181818] dark:hover:bg-white",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:text-white dark:hover:bg-red-500",
        outline:
          "border border-[#E5E0D8] bg-white text-[#181818] shadow-xs hover:bg-[#FAF8F5] hover:border-[#DCD6CA] dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-[#FAF8F5] dark:hover:bg-slate-800",
        secondary:
          "bg-[#EFEAE2] text-[#181818] shadow-xs hover:bg-[#E5E0D8] dark:bg-[#1E2638] dark:text-[#FAF8F5] dark:hover:bg-slate-700",
        ghost:
          "text-[#645E54] hover:bg-[#EFEAE2] hover:text-[#181818] dark:text-[#94A3B8] dark:hover:bg-slate-800 dark:hover:text-[#FAF8F5]",
        link: "text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500",
        pillSolid:
          "rounded-full bg-[#181818] text-white shadow-sm hover:bg-black dark:bg-[#FAF8F5] dark:text-[#181818] dark:hover:bg-white border border-transparent",
        pillOutline:
          "rounded-full border border-[#DCD6CA] bg-white text-[#181818] shadow-xs hover:border-[#BDB5A7] hover:bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-[#FAF8F5] dark:hover:bg-slate-800",
        pillEmerald:
          "rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 border border-emerald-500/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-6 text-base",
        pill: "h-8 sm:h-9 rounded-full px-4 text-xs font-semibold",
        pillLg: "h-10 sm:h-11 rounded-full px-5 text-xs sm:text-sm font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
