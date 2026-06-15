"use client";
import PageHeader from "@/components/PageHeader";
import StatsPlayerTable from "@/components/stats/StatsPlayerTable";
import StatsRankingCard from "@/components/stats/StatsRankingCard";
import TeamSummaryCard from "@/components/stats/TeamSummaryCard";
import { useMatches } from "@/hooks/useMatches";
import { usePlayers } from "@/hooks/usePlayers";
import {
  getPlayerStats,
  getRankPlayerStats,
  getRecentResults,
  getTeamSummary,
  getTopAppearances,
  getTopAssisters,
  getTopScorers,
} from "@/lib/stats";
import { MatchRecordMap } from "@/types/match";
import { MatchVotesByMatchId } from "@/types/match-vote";
import { useEffect, useMemo, useState } from "react";

export default function StatPage() {
  const { matches } = useMatches();
  const { players } = usePlayers();
  const [records, setRecords] = useState<MatchRecordMap>({});
  const [votes, setVotes] = useState<MatchVotesByMatchId>({});

  useEffect(() => {
    const savedRecords = localStorage.getItem("match-records");

    if (savedRecords && savedRecords !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecords(JSON.parse(savedRecords));
      } catch {
        localStorage.removeItem("match-records");
      }
    }
  }, []);

  useEffect(() => {
    const savedVotes = localStorage.getItem("match-votes");

    if (savedVotes && savedVotes !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVotes(JSON.parse(savedVotes));
      } catch {
        localStorage.removeItem("match-votes");
      }
    }
  }, []);

  // 최근 5경기 결과 계산
  const recentResults = useMemo(
    () => getRecentResults(matches, records),
    [matches, records],
  );

  // 전적 계산
  const teamSummary = useMemo(
    () => getTeamSummary(matches, records),
    [matches, records],
  );

  // 선수 통계 기준 배열
  const playerStats = useMemo(
    () => getPlayerStats(players, matches, votes, records),
    [players, matches, votes, records],
  );

  // 득점 순위 top3
  const topScorers = useMemo(() => getTopScorers(playerStats), [playerStats]);

  // 어시스트 순위 top3
  const topAssisters = useMemo(
    () => getTopAssisters(playerStats),
    [playerStats],
  );

  // 출전 순위 top3
  const topAppearances = useMemo(
    () => getTopAppearances(playerStats),
    [playerStats],
  );

  // 표용 정렬 배열
  const rankedPlayerStats = useMemo(
    () => getRankPlayerStats(playerStats),
    [playerStats],
  );

  const scorerRankingItems = topScorers.map((player) => ({
    id: player.id,
    name: player.name,
    value: player.goal,
  }));

  const assisterRankingItems = topAssisters.map((player) => ({
    id: player.id,
    name: player.name,
    value: player.assist,
  }));

  const appearanceRankingItems = topAppearances.map((player) => ({
    id: player.id,
    name: player.name,
    value: player.appearance,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="통계"
        description="팀 전적과 선수 랭킹을 한눈에 확인하세요."
      />
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
      <section className="grid gap-4 xl:grid-cols-3">
        <StatsRankingCard
          title="득점 순위"
          items={scorerRankingItems}
          barClassName="bg-emerald-400"
        />
        <StatsRankingCard
          title="어시스트 순위"
          items={assisterRankingItems}
          barClassName="bg-sky-400"
        />
        <StatsRankingCard
          title="출전 순위"
          items={appearanceRankingItems}
          barClassName="bg-amber-400"
        />
      </section>
      <StatsPlayerTable players={rankedPlayerStats} />
    </div>
  );
}
