"use client";
import PageHeader from "@/components/PageHeader";
import { useMemo, useState } from "react";
import { useMatches } from "@/hooks/matches/useMatches";
import { getMatchListData } from "@/lib/matches/match-ui";
import useMatchRecordsMap from "@/hooks/matches/useMatchRecordMap";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import type { MatchCreateFormValue } from "@/types/match";
import MatchSection from "./list/MatchSection";
import MatchCreateModal from "./list/create/MatchCreateModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTeamSeasons } from "@/hooks/settings/useTeamSeasons";
import ContentState from "../common/ContentState";
import { useCurrentTeam } from "@/hooks/team/useCurrentTeam";
import { getSelectedSeason } from "@/lib/settings/settings-ui";
import SeasonSelect from "../common/SeasonSelect";

export default function MatchesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { team, teamLoaded } = useCurrentTeam();
  const { records, recordsLoaded } = useMatchRecordsMap();
  const { canManage, memberLoaded } = useCurrentTeamMember();

  const { seasons, seasonsLoaded, seasonsError, reloadSeasons } =
    useTeamSeasons();

  const requestedSeasonId = searchParams.get("season");

  const selectedSeason = getSelectedSeason(seasons, requestedSeasonId);

  const { matches, matchesLoaded, matchesError, addMatch, reloadMatches } =
    useMatches({
      seasonId: selectedSeason?.id,
    });

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { displayMatches, upcomingMatches, pastMatches } = useMemo(
    () => getMatchListData(matches, records),
    [matches, records],
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

    return success;
  };

  const handleChangeSeason = (seasonId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", seasonId);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const pageError = seasonsError || matchesError;

  const handleRetry = async () => {
    await Promise.all([reloadSeasons(), reloadMatches()]);
  };

  if (
    !teamLoaded ||
    !matchesLoaded ||
    !recordsLoaded ||
    !memberLoaded ||
    !seasonsLoaded
  ) {
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

  if (pageError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />

        <ContentState
          variant="error"
          title="경기 일정을 불러오지 못했어요."
          description={pageError}
          action={
            <button
              type="button"
              onClick={() => void handleRetry()}
              className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              다시 시도
            </button>
          }
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
        <SeasonSelect
          seasons={seasons}
          selectedSeasonId={selectedSeason?.id}
          ariaLabel="조회할 시즌 선택"
          onChange={handleChangeSeason}
        />

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
          defaultSport={team?.sport ?? "soccer"}
          onClose={handleCloseCreate}
          onSave={handleCreateMatch}
        />
      )}
    </div>
  );
}
