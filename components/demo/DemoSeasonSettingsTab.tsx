"use client";

import SeasonCreateCard from "@/components/settings/season/SeasonCreateCard";
import SeasonList from "@/components/settings/season/SeasonList";
import { demoSeasons } from "@/lib/demo/demo-matches-data";
import { formatSeasonPeriod } from "@/lib/settings/settings-ui";
import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { CalendarCheck2 } from "lucide-react";
import { useState } from "react";

export default function DemoSeasonSettingsTab() {
  const [seasons, setSeasons] = useState<TeamSeason[]>(demoSeasons);

  const activeSeason = seasons.find((season) => season.isActive);

  const handleCreateSeason = async (value: TeamSeasonFormValue) => {
    const hasSameName = seasons.some((season) => season.name === value.name);

    if (hasSameName) return false;

    const now = new Date().toISOString();

    setSeasons((current) => [
      {
        id: crypto.randomUUID(),
        teamId: "demo-team",
        ...value,
        isActive: current.length === 0,
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ]);

    return true;
  };

  const handleUpdateSeason = async (
    seasonId: string,
    value: TeamSeasonFormValue,
  ) => {
    setSeasons((current) =>
      current.map((season) =>
        season.id === seasonId
          ? { ...season, ...value, updatedAt: new Date().toISOString() }
          : season,
      ),
    );

    return true;
  };

  const handleSetActiveSeason = async (seasonId: string) => {
    setSeasons((current) =>
      current.map((season) => ({
        ...season,
        isActive: season.id === seasonId,
        updatedAt: new Date().toISOString(),
      })),
    );

    return true;
  };

  const handleDeleteSeason = async (seasonId: string) => {
    const target = seasons.find((season) => season.id === seasonId);

    if (!target || target.isActive) return false;

    setSeasons((current) => current.filter((season) => season.id !== seasonId));

    return true;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {activeSeason && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm sm:h-12 sm:w-12">
              <CalendarCheck2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
                현재 활성 시즌
              </p>
              <h2 className="mt-0.5 truncate text-lg font-semibold text-stone-900 sm:mt-1 sm:text-xl">
                {activeSeason.name}
              </h2>
              <p className="mt-0.5 text-xs text-stone-500 sm:mt-1 sm:text-sm">
                {formatSeasonPeriod(
                  activeSeason.startDate,
                  activeSeason.endDate,
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <SeasonCreateCard canManage onCreate={handleCreateSeason} />

      <SeasonList
        seasons={seasons}
        canManage
        onUpdate={handleUpdateSeason}
        onSetActive={handleSetActiveSeason}
        onDelete={handleDeleteSeason}
      />
    </div>
  );
}
