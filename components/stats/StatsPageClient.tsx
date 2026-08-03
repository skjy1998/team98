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

export default function StatsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = getStatsTab(searchParams.get("tab"));

  const { isLoaded, myStats, teamStats, rankedPlayerStats } =
    useStatsPageData();

  const handleChangeTab = (tab: StatsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />

      {!isLoaded ? (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          통계 데이터를 불러오는 중...
        </div>
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
