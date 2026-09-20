"use client";
import PageHeader from "@/components/PageHeader";
import StatsPlayerTable from "@/components/stats/StatsPlayerTable";
import type { StatsTab } from "@/types/stats";
import StatsTabs from "./StatsTabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getStatsTab } from "@/lib/stats/stats-ui";
import TeamStatsTab from "./TeamStatsTab";
import MyStatsTab from "./MyStatsTab";
import useStatsPageData from "@/hooks/stats/useStatsPageData";
import { useTeamSeasons } from "@/hooks/settings/useTeamSeasons";
import ContentState from "../common/ContentState";
import { getSelectedSeason } from "@/lib/settings/settings-ui";
import SeasonSelect from "../common/SeasonSelect";

export default function StatsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = getStatsTab(searchParams.get("tab"));

  const { seasons, seasonsLoaded, seasonsError, reloadSeasons } =
    useTeamSeasons();

  const requestedSeasonId = searchParams.get("season");

  const selectedSeason = getSelectedSeason(seasons, requestedSeasonId);

  const {
    isLoaded,
    pageError,
    reloadPageData,
    myStats,
    teamStats,
    rankedPlayerStats,
  } = useStatsPageData(selectedSeason?.id);

  const handleChangeTab = (tab: StatsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleChangeSeason = (seasonId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", seasonId);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />
      <div className="flex items-center gap-2 sm:gap-3">
        <SeasonSelect
          seasons={seasons}
          selectedSeasonId={selectedSeason?.id}
          ariaLabel="통계 시즌 선택"
          onChange={handleChangeSeason}
        />

        <span className="text-xs text-stone-500 sm:text-sm">시즌 기록</span>
      </div>

      {!isLoaded || !seasonsLoaded ? (
        <ContentState
          variant="loading"
          title="통계 데이터를 불러오는 중..."
          description="팀과 선수의 시즌 기록을 계산하고 있어요."
        />
      ) : pageError || seasonsError ? (
        <ContentState
          variant="error"
          title="통계 데이터를 불러오지 못했어요."
          description={pageError || seasonsError}
          action={
            <button
              type="button"
              onClick={() => {
                void Promise.all([reloadSeasons(), reloadPageData()]);
              }}
              className="rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-stone-700 sm:px-4 sm:text-sm"
            >
              다시 시도
            </button>
          }
        />
      ) : (
        <>
          <StatsTabs activeTab={activeTab} onChangeTab={handleChangeTab} />
          {activeTab === "team" && <TeamStatsTab data={teamStats} />}
          {activeTab === "me" && <MyStatsTab data={myStats} />}
          {activeTab === "ranking" && (
            <StatsPlayerTable
              players={rankedPlayerStats}
              currentPlayerId={myStats.player?.id}
            />
          )}
        </>
      )}
    </div>
  );
}
