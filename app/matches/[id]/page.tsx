"use client";

import MatchDetailHeader from "@/components/matches/detail/MatchDetailHeader";
import MatchDetailTabs, {
  MatchDetailTab,
} from "@/components/matches/detail/MatchDetailTabs";
import { MatchInfoTab } from "@/components/matches/detail/MatchInfoTab";
import MatchRecordTab from "@/components/matches/detail/MatchRecordTab";
import MatchTabPlaceholder from "@/components/matches/detail/MatchTabPlaceholder";
import MatchVoteTab from "@/components/matches/detail/MatchVoteTab";
import { useMatches } from "@/hooks/useMatches";
import { useMatchRecords } from "@/hooks/useMatchRecords";
import {
  getMatchDetailStatusLabel,
  getMatchDetailSubText,
  getMatchResult,
  getOpponentName,
  statusMap,
} from "@/lib/match-ui";
import { MatchCreateFormValue } from "@/types/match";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useMemo, useState } from "react";

export default function MatchDetailPage() {
  const [activeTab, setActiveTab] = useState<MatchDetailTab>("info");
  const { matches, matchesLoaded, setMatches } = useMatches();
  const router = useRouter();

  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const match = useMemo(() => {
    return matches.find((item) => item.id === id);
  }, [matches, id]);

  const safeMatchId = match?.id ?? "";

  const {
    loaded: recordsLoaded,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
  } = useMatchRecords(safeMatchId);

  if (!matchesLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">경기 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-stone-900">
          경기 정보를 찾을 수 없어요.
        </p>
        <Link
          href="/matches"
          className="mt-4 inline-flex text-sm font-medium text-emerald-700"
        >
          일정 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleUpdateMatch = (value: MatchCreateFormValue) => {
    if (!match) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchDate = new Date(value.date);
    matchDate.setHours(0, 0, 0, 0);

    const isUpcoming = matchDate >= today;

    setMatches((prev) =>
      prev.map((item) =>
        item.id === match.id
          ? {
              ...item,
              title: value.title,
              type: value.type,
              date: value.date,
              startTime: value.startTime,
              endTime: value.endTime,
              opponent: value.opponent,
              location: value.location,
              isUpcoming,
            }
          : item,
      ),
    );
  };

  const handleDeleteMatch = () => {
    if (!match) return;

    const confirmed = window.confirm("이 경기를 삭제할까요?");
    if (!confirmed) return;

    setMatches((prev) => prev.filter((item) => item.id !== match.id));
    router.push("/matches");
  };

  const resolvedMatch =
    recordsLoaded && events.length > 0
      ? {
          ...match,
          ourScore,
          opponentScore,
        }
      : match;

  const displayScore =
    resolvedMatch.ourScore !== undefined &&
    resolvedMatch.opponentScore !== undefined
      ? `${resolvedMatch.ourScore}:${resolvedMatch.opponentScore}`
      : "-";

  const result = getMatchResult(resolvedMatch);
  const matchStatusLabel = getMatchDetailStatusLabel(resolvedMatch);
  const status = statusMap[result];
  const matchSubText = getMatchDetailSubText(resolvedMatch);
  const opponentName = getOpponentName(resolvedMatch);

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-800"
      >
        <ChevronLeft className="h-4 w-4" />
        일정 목록
      </Link>

      <MatchDetailHeader
        match={resolvedMatch}
        displayScore={displayScore}
        matchStatusLabel={matchStatusLabel}
        matchSubText={matchSubText}
        opponentName={opponentName}
        statusBadgeClassName={status.badgeClassName}
      />

      <MatchDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && (
        <MatchInfoTab
          match={resolvedMatch}
          onSave={handleUpdateMatch}
          onDelete={handleDeleteMatch}
        />
      )}
      {activeTab === "tactics" && <MatchTabPlaceholder label="전술" />}
      {activeTab === "vote" && <MatchVoteTab matchId={match.id} />}
      {activeTab === "record" && (
        <MatchRecordTab
          events={events}
          recordsLoaded={recordsLoaded}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          updateEvent={updateEvent}
        />
      )}
      {activeTab === "review" && <MatchTabPlaceholder label="후기" />}
    </div>
  );
}
