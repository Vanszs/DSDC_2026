import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success" | "neutral";
  className?: string;
  badge?: string;
  subtitle?: string;
  sparklineData?: number[];
  benchmark?: {
    label: string;
    value: string | number;
  };
  statusIndicator?: "live" | "warning" | "critical" | "nominal" | "standby";
  unit?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  variant = "default",
  className,
  badge,
  subtitle,
  sparklineData,
  benchmark,
  statusIndicator,
  unit,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return "border border-red-200 bg-white dark:border-red-900 dark:bg-[#080C14]";
      case "warning":
        return "border border-amber-200 bg-white dark:border-amber-900 dark:bg-[#080C14]";
      case "success":
        return "border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-[#080C14]";
      case "neutral":
        return "border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#080C14]";
      default:
        return "border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#080C14]";
    }
  };

  const getIconContainerStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
      case "success":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "neutral":
        return "bg-slate-100 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200 border border-slate-200 dark:border-slate-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200 border border-slate-200 dark:border-slate-800";
    }
  };

  const getSparklineColor = () => {
    switch (variant) {
      case "danger":
        return { stroke: "#dc2626", fill: "rgba(220, 38, 38, 0.12)" };
      case "warning":
        return { stroke: "#d97706", fill: "rgba(217, 119, 6, 0.12)" };
      case "success":
        return { stroke: "#059669", fill: "rgba(5, 150, 105, 0.12)" };
      default:
        return { stroke: "#52525b", fill: "rgba(82, 82, 91, 0.10)" };
    }
  };

  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 120;
    const height = 28;
    const padding = 2;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min === 0 ? 1 : max - min;

    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathData = `M ${points.join(" L ")}`;
    const areaData = `${pathData} L ${width - padding},${height} L ${padding},${height} Z`;
    const sparkColor = getSparklineColor();
    const lastPoint = points[points.length - 1].split(",");

    return (
      <div className="flex flex-col items-end" aria-hidden="true">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
        >
          <path d={areaData} fill={sparkColor.fill} />
          <path
            d={pathData}
            fill="none"
            stroke={sparkColor.stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r="2.5"
            fill={sparkColor.stroke}
            className="animate-pulse"
          />
        </svg>
        <span className="text-[9px] font-mono font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 tracking-tight">
          14D TREND
        </span>
      </div>
    );
  };

  const renderStatusDot = () => {
    if (!statusIndicator) return null;
    const indicatorConfig = {
      live: { dot: "bg-emerald-500", text: "LIVE", textClass: "text-emerald-700 dark:text-emerald-400" },
      warning: { dot: "bg-amber-500", text: "SIAGA", textClass: "text-amber-700 dark:text-amber-400" },
      critical: { dot: "bg-red-500 animate-ping", text: "KRITIS", textClass: "text-red-700 dark:text-red-400" },
      nominal: { dot: "bg-teal-500", text: "NOMINAL", textClass: "text-teal-700 dark:text-teal-400" },
      standby: { dot: "bg-zinc-400", text: "STANDBY", textClass: "text-zinc-600 dark:text-zinc-400" },
    }[statusIndicator];

    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
        <span className={cn("h-1.5 w-1.5 rounded-full inline-block", indicatorConfig.dot)} />
        <span className={cn("text-[9px] font-mono font-bold tracking-wider uppercase", indicatorConfig.textClass)}>
          {indicatorConfig.text}
        </span>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-150 active-press rounded-xl shadow-sm",
        getVariantStyles(),
        className
      )}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
        {/* Header Strip: Title + Status + Icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-400">
                {title}
              </p>
              {badge && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md bg-slate-200 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-300 border border-transparent dark:border-slate-800">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {renderStatusDot()}
            {Icon && (
              <div
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  getIconContainerStyles()
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Telemetry Numeric Row + Sparkline */}
        <div className="flex items-end justify-between gap-2 pt-1 min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono-num tracking-tight text-slate-900 dark:text-slate-100 break-words">
                {value}
              </div>
              {unit && (
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {unit}
                </span>
              )}
              {trend && (
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono-num px-1.5 py-0.5 rounded-md border ml-1",
                    trend.positive
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>

            {benchmark && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="text-slate-400 dark:text-slate-500">REF:</span>
                <span>{benchmark.label}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{benchmark.value}</span>
              </div>
            )}
          </div>

          {/* Mini Sparkline Histogram Vector */}
          {sparklineData && (
            <div className="shrink-0">
              {renderSparkline()}
            </div>
          )}
        </div>

        {/* Description / Policy Context Footer */}
        {description && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug font-sans line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
