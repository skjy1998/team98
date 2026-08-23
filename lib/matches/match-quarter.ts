import type { MatchQuarter } from "@/types/tactics";

export function createQuarterOptions(quarterCount: number): MatchQuarter[] {
  const normalizedCount =
    Number.isFinite(quarterCount) && quarterCount > 0
      ? Math.floor(quarterCount)
      : 1;

  return Array.from(
    { length: normalizedCount },
    (_, index) => `${index + 1}Q` as MatchQuarter,
  );
}
