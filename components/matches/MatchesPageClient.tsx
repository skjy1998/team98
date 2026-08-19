"use client";
import PageHeader from "@/components/PageHeader";
import { useMemo, useState } from "react";
import { useMatches } from "@/hooks/matches/useMatches";
import { getDisplayMatches, getIsUpcomingMatch } from "@/lib/matches/match-ui";
import useMatchRecordsMap from "@/hooks/matches/useMatchRecordMap";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import type { MatchCreateFormValue } from "@/types/match";
import MatchSection from "./list/MatchSection";
import MatchCreateModal from "./list/create/MatchCreateModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTeamSeasons } from "@/hooks/settings/useTeamSeasons";
import { ChevronDown } from "lucide-react";
import ContentState from "../common/ContentState";

export default function MatchesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { records, recordsLoaded } = useMatchRecordsMap();
  const { canManage, memberLoaded } = useCurrentTeamMember();

  const { seasons, activeSeason, seasonsLoaded } = useTeamSeasons();

  const requestedSeasonId = searchParams.get("season");

  const selectedSeason =
    seasons.find((season) => season.id === requestedSeasonId) ?? activeSeason;

  const { matches, matchesLoaded, addMatch } = useMatches({
    seasonId: selectedSeason?.id,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const displayMatches = useMemo(
    () => getDisplayMatches(matches, records),
    [matches, records],
  );

  const upcomingMatches = useMemo(
    () =>
      displayMatches
        .filter((match) => getIsUpcomingMatch(match.date))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [displayMatches],
  );
  const pastMatches = useMemo(
    () =>
      displayMatches
        .filter((match) => !getIsUpcomingMatch(match.date))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [displayMatches],
  );

  const totalMatchesCount = displayMatches.length;
  const hasMatches = totalMatchesCount > 0;
  const emptyDescription = canManage
    ? "일정 등록 버튼으로 첫 경기를 추가해보세요."
    : "아직 등록된 경기 일정이 없어요.";

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateMatch = async (value: MatchCreateFormValue) => {
    const success = await addMatch(value);

    if (success) {
      setIsCreateOpen(false);
    }
  };

  const handleChangeSeason = (seasonId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", seasonId);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  if (!matchesLoaded || !recordsLoaded || !memberLoaded || !seasonsLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        <ContentState
          variant="loading"
          title="경기 일정을 불러오는 중..."
          description="등록된 경기와 투표 정보를 준비하고 있어요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />
        {canManage && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            + 일정 등록
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <select
            value={selectedSeason?.id ?? ""}
            onChange={(event) => handleChangeSeason(event.target.value)}
            className="h-10 appearance-none rounded-xl border border-stone-200 bg-white pl-4 pr-10 text-sm font-semibold text-stone-700 outline-none transition focus:border-emerald-400"
            aria-label="조회할 시즌 선택"
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

        <span className="text-sm font-medium text-stone-500">
          총 {displayMatches.length}경기
        </span>
      </div>
      {!canManage && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          현재 계정은 읽기 전용이에요. 회장 또는 운영진만 경기 일정을 등록하고
          수정할 수 있어요.
        </div>
      )}

      {!hasMatches ? (
        <ContentState
          variant="empty"
          title="등록된 경기 일정이 없어요."
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={upcomingMatches} />
          <MatchSection title="지난 경기" items={pastMatches} />
        </div>
      )}
      {isCreateOpen && (
        <MatchCreateModal
          onClose={handleCloseCreate}
          onSave={handleCreateMatch}
        />
      )}
    </div>
  );
}
