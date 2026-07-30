"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatsPlayerTable from "@/components/stats/StatsPlayerTable";
import StatsRankingSection from "@/components/stats/StatsRankingSection";
import TeamSummaryCard from "@/components/stats/TeamSummaryCard";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import { useMatches } from "@/hooks/matches/useMatches";
import useMatchRecordsMap from "@/hooks/matches/useMatchRecordMap";
import { useMatchVotes } from "@/hooks/matches/useMatchVotes";
import { usePlayers } from "@/hooks/players/usePlayers";
import {
  getPlayerStats,
  getRankingItems,
  getRankPlayerStats,
  getRecentResults,
  getTeamSummary,
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "@/lib/stats/stats";

type StatsTab = "team" | "ranking" | "me";

export default function StatsPageClient() {
  const { matches, matchesLoaded } = useMatches();
  const { players, playersLoaded } = usePlayers();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { votes, votesLoaded } = useMatchVotes();
  const { member, memberLoaded } = useCurrentTeamMember();

  const [activeTab, setActiveTab] = useState<StatsTab>("team");

  const recentResults = useMemo(
    () => getRecentResults(matches, records),
    [matches, records],
  );

  const teamSummary = useMemo(
    () => getTeamSummary(matches, records),
    [matches, records],
  );

  const { topScorers, topAssisters, topAppearances, rankedPlayerStats } =
    useMemo(() => {
      const playerStats = getPlayerStats(players, matches, votes, records);

      return {
        topScorers: getTopScorers(playerStats),
        topAssisters: getTopAssisters(playerStats),
        topAppearances: getTopAppearances(playerStats),
        rankedPlayerStats: getRankPlayerStats(playerStats),
      };
    }, [players, matches, votes, records]);

  const scorerRankingItems = getRankingItems(topScorers, "goal");
  const assisterRankingItems = getRankingItems(topAssisters, "assist");
  const appearanceRankingItems = getRankingItems(topAppearances, "appearance");

  const myPlayerStats = useMemo(
    () => rankedPlayerStats.find((player) => player.userId === member?.userId),
    [rankedPlayerStats, member?.userId],
  );

  const myGoalRank = useMemo(() => {
    if (!myPlayerStats) return null;
    const index = topScorers.findIndex(
      (player) => player.id === myPlayerStats.id,
    );
    return index >= 0 ? index + 1 : null;
  }, [myPlayerStats, topScorers]);

  const myAssistRank = useMemo(() => {
    if (!myPlayerStats) return null;
    const index = topAssisters.findIndex(
      (player) => player.id === myPlayerStats.id,
    );
    return index >= 0 ? index + 1 : null;
  }, [myPlayerStats, topAssisters]);

  const myAppearanceRank = useMemo(() => {
    if (!myPlayerStats) return null;
    const index = topAppearances.findIndex(
      (player) => player.id === myPlayerStats.id,
    );
    return index >= 0 ? index + 1 : null;
  }, [myPlayerStats, topAppearances]);

  const isLoaded =
    matchesLoaded &&
    playersLoaded &&
    recordsLoaded &&
    votesLoaded &&
    memberLoaded;

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
          <div className="rounded-xl border border-stone-200 bg-white p-1">
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: "team", label: "팀 기록" },
                { key: "ranking", label: "선수 랭킹" },
                { key: "me", label: "내 기록" },
              ].map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as StatsTab)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-stone-500 hover:bg-stone-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "team" && (
            <div className="space-y-6">
              <TeamSummaryCard
                win={teamSummary.win}
                draw={teamSummary.draw}
                lose={teamSummary.lose}
                winRate={teamSummary.winRate}
                goals={teamSummary.goals}
                conceded={teamSummary.conceded}
                goalDiff={teamSummary.goalDiff}
                recentResults={recentResults}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-stone-200 bg-white px-5 py-5">
                  <p className="text-sm font-medium text-stone-500">총 경기</p>
                  <p className="mt-2 text-2xl font-bold text-stone-900">
                    {teamSummary.total}
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white px-5 py-5">
                  <p className="text-sm font-medium text-stone-500">
                    경기당 평균 득점
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {teamSummary.total > 0
                      ? (teamSummary.goals / teamSummary.total).toFixed(1)
                      : "0.0"}
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white px-5 py-5">
                  <p className="text-sm font-medium text-stone-500">
                    경기당 평균 실점
                  </p>
                  <p className="mt-2 text-2xl font-bold text-rose-600">
                    {teamSummary.total > 0
                      ? (teamSummary.conceded / teamSummary.total).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>

              <StatsRankingSection
                scorerRankingItems={scorerRankingItems}
                assisterRankingItems={assisterRankingItems}
                appearanceRankingItems={appearanceRankingItems}
              />
            </div>
          )}

          {activeTab === "ranking" && (
            <StatsPlayerTable players={rankedPlayerStats} />
          )}

          {activeTab === "me" && (
            <section className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-stone-900">내 기록</h2>

              {!myPlayerStats ? (
                <p className="mt-4 text-sm text-stone-500">
                  현재 계정에 연결된 선수 정보가 없어서 개인 기록을 불러올 수
                  없어요.
                </p>
              ) : (
                <div className="mt-5 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-xl bg-stone-50 px-4 py-5 text-center">
                      <p className="text-2xl font-bold text-stone-900">
                        {myPlayerStats.appearance}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">출전</p>
                    </div>

                    <div className="rounded-xl bg-stone-50 px-4 py-5 text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {myPlayerStats.goal}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">득점</p>
                    </div>

                    <div className="rounded-xl bg-stone-50 px-4 py-5 text-center">
                      <p className="text-2xl font-bold text-sky-600">
                        {myPlayerStats.assist}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">어시스트</p>
                    </div>

                    <div className="rounded-xl bg-stone-50 px-4 py-5 text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {myPlayerStats.attackPoint}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">공격포인트</p>
                    </div>

                    <div className="rounded-xl bg-stone-50 px-4 py-5 text-center">
                      <p className="text-2xl font-bold text-violet-600">
                        {myPlayerStats.attendanceRate}%
                      </p>
                      <p className="mt-1 text-sm text-stone-500">출석률</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-stone-900">
                        내 순위 요약
                      </h3>
                      <span className="text-xs font-medium text-stone-400">
                        TEAM RANK
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg bg-white px-4 py-4">
                        <p className="text-sm text-stone-500">득점 순위</p>
                        <p className="mt-2 text-xl font-bold text-emerald-600">
                          {myGoalRank ? `${myGoalRank}위` : "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white px-4 py-4">
                        <p className="text-sm text-stone-500">어시스트 순위</p>
                        <p className="mt-2 text-xl font-bold text-sky-600">
                          {myAssistRank ? `${myAssistRank}위` : "-"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white px-4 py-4">
                        <p className="text-sm text-stone-500">출전 순위</p>
                        <p className="mt-2 text-xl font-bold text-amber-600">
                          {myAppearanceRank ? `${myAppearanceRank}위` : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
