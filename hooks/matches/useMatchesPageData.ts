import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import useMatchRecordsMap from "./useMatchRecordMap";
import { useTeamSeasons } from "../settings/useTeamSeasons";
import { getSelectedSeason } from "@/lib/settings/settings-ui";
import { useMatches } from "./useMatches";
import { useMemo, useState } from "react";

import type { MatchCreateFormValue } from "@/types/match";
import { getMatchListData } from "@/lib/matches/match-list-ui";

export function useMatchesPageData() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { team, teamLoaded, teamError, reloadTeam } = useCurrentTeam();
  const { canManage, memberLoaded, memberError, reloadMember } =
    useCurrentTeamMember();

  const { records, recordsLoaded, recordsError, reloadRecords } =
    useMatchRecordsMap();

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

  const handleRetry = async () => {
    await Promise.all([
      reloadTeam(),
      reloadMember(),
      reloadSeasons(),
      reloadMatches(),
      reloadRecords(),
    ]);
  };

  const isLoaded =
    teamLoaded &&
    matchesLoaded &&
    recordsLoaded &&
    memberLoaded &&
    seasonsLoaded;

  const pageError =
    teamError || memberError || seasonsError || matchesError || recordsError;

  const canCreateMatch = canManage && selectedSeason?.isActive === true;

  return {
    defaultSport: team?.sport ?? "soccer",
    canManage,
    seasons,
    selectedSeason,
    displayMatches,
    upcomingMatches,
    pastMatches,
    isLoaded,
    pageError,
    isCreateOpen,
    onOpenCreate: () => setIsCreateOpen(true),
    onCloseCreate: () => setIsCreateOpen(false),
    onCreateMatch: handleCreateMatch,
    onChangeSeason: handleChangeSeason,
    onRetry: handleRetry,
    canCreateMatch,
  };
}
