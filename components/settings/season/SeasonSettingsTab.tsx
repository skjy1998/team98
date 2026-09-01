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
