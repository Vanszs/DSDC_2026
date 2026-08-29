import { describe, it, expect } from "vitest";
import { cn, formatScore, getRiskLevel } from "@/lib/utils";

describe("Utility Functions (lib/utils)", () => {
  it("cn merges class names properly", () => {
    expect(cn("bg-red-500", "p-4")).toBe("bg-red-500 p-4");
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-white", false && "hidden", null, undefined)).toBe("text-white");
  });

  it("formatScore rounds numbers to string correctly", () => {
    expect(formatScore(75.6)).toBe("76");
    expect(formatScore(75.2)).toBe("75");
    expect(formatScore(0)).toBe("0");
    expect(formatScore(100)).toBe("100");
  });

  it("getRiskLevel returns correct status, color, and badge classes", () => {
    const high = getRiskLevel(80);
    expect(high.level).toBe("Tinggi");
    expect(high.color).toBe("#ef4444");
    expect(high.badgeClass).toContain("bg-red-100");

    const highBoundary = getRiskLevel(70);
    expect(highBoundary.level).toBe("Tinggi");

    const med = getRiskLevel(55);
    expect(med.level).toBe("Sedang");
    expect(med.color).toBe("#f59e0b");
    expect(med.badgeClass).toContain("bg-amber-100");

    const medBoundary = getRiskLevel(45);
    expect(medBoundary.level).toBe("Sedang");

    const low = getRiskLevel(30);
    expect(low.level).toBe("Rendah");
    expect(low.color).toBe("#10b981");
    expect(low.badgeClass).toContain("bg-emerald-100");
  });
});
