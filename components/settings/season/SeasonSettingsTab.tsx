import { useTeamSeasons } from "@/hooks/settings/useTeamSeasons";
import { CalendarCheck2 } from "lucide-react";
import SeasonCreateCard from "./SeasonCreateCard";
import SeasonList from "./SeasonList";

function formatSeasonPeriod(startDate: string, endDate?: string) {
  const format = (value: string) =>
    new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(`${value}T00:00:00`));

  return `${format(startDate)} - ${endDate ? format(endDate) : "종로일 미정"}`;
}

export default function SeasonSettingsTab() {
  const {
    seasons,
    activeSeason,
    seasonsLoaded,
    seasonsError,
    canManage,
    createSeason,
    updateSeason,
    setActiveSeason,
    deleteSeason,
  } = useTeamSeasons();

  if (!seasonsLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
        시즌 정보를 불러오는 중...
      </div>
    );
  }

  if (seasonsError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-10 text-center">
        <p className="text-sm font-medium text-rose-600">{seasonsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeSeason && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <CalendarCheck2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-600">
                현재 활성 시즌
              </p>
              <h2 className="mt-1 text-xl font-semibold text-stone-900">
                {activeSeason.name}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {formatSeasonPeriod(
                  activeSeason.startDate,
                  activeSeason.endDate,
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <SeasonCreateCard canManage={canManage} onCreate={createSeason} />

      <SeasonList
        seasons={seasons}
        canManage={canManage}
        onUpdate={updateSeason}
        onSetActive={setActiveSeason}
        onDelete={deleteSeason}
      />
    </div>
  );
}
