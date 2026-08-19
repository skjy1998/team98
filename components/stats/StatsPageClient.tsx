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
import { ChevronDown } from "lucide-react";
import ContentState from "../common/ContentState";

export default function StatsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = getStatsTab(searchParams.get("tab"));

  const { seasons, activeSeason, seasonsLoaded } = useTeamSeasons();

  const requestedSeasonId = searchParams.get("season");

  const selectedSeason =
    seasons.find((season) => season.id === requestedSeasonId) ?? activeSeason;

  const { isLoaded, myStats, teamStats, rankedPlayerStats } = useStatsPageData(
    selectedSeason?.id,
  );

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
    <div className="space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedSeason?.id ?? ""}
            onChange={(event) => handleChangeSeason(event.target.value)}
            className="h-10 appearance-none rounded-xl border border-stone-200 bg-white pl-4 pr-10 text-sm font-semibold text-stone-700 outline-none transition focus:border-emerald-400"
            aria-label="통계 시즌 선택"
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
                {season.isActive ? " (활성)" : ""}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          />
        </div>

        <span className="text-sm text-stone-500">시즌 기록</span>
      </div>

      {!isLoaded || !seasonsLoaded ? (
        <ContentState
          variant="loading"
          title="통계 데이터를 불러오는 중..."
          description="팀과 선수의 시즌 기록을 계산하고 있어요."
        />
      ) : (
        <>
          <StatsTabs activeTab={activeTab} onChangeTab={handleChangeTab} />
          {activeTab === "team" && <TeamStatsTab data={teamStats} />}
          {activeTab === "me" && <MyStatsTab data={myStats} />}
          {activeTab === "ranking" && (
            <StatsPlayerTable players={rankedPlayerStats} />
          )}
        </>
      )}
    </div>
  );
}
