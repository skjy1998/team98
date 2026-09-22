import { useTeamSeasons } from "@/hooks/settings/useTeamSeasons";
import { CalendarCheck2 } from "lucide-react";
import SeasonCreateCard from "./SeasonCreateCard";
import SeasonList from "./SeasonList";
import ContentState from "@/components/common/ContentState";
import { formatSeasonPeriod } from "@/lib/settings/settings-ui";

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
    reloadSeasons,
  } = useTeamSeasons();

  if (!seasonsLoaded) {
    return (
      <ContentState
        variant="loading"
        title="시즌 정보를 불러오는 중..."
        description="등록된 시즌과 경기 연결 정보를 확인하고 있어요."
      />
    );
  }

  if (seasonsError) {
    return (
      <ContentState
        variant="error"
        title="시즌 정보를 불러오지 못했어요."
        description={seasonsError}
        action={
          <button
            type="button"
            onClick={() => void reloadSeasons()}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            다시 시도
          </button>
        }
      />
    );
  }

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
