import {
  createMatchRecordQuarterSections,
  getGroupedMatchRecordEvents,
  getSelfMatchPlayersBySide,
} from "@/lib/matches/match-record";
import type { MatchRecordEvent } from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import { useMemo } from "react";

interface UseMatchRecordViewDataParams {
  events: MatchRecordEvent[];
  quarterCount: number;
  attendPlayers: PlayerType[];
  votes: MatchVote[];
}

export function useMatchRecordViewData({
  events,
  quarterCount,
  attendPlayers,
  votes,
}: UseMatchRecordViewDataParams) {
  const quarterSections = useMemo(
    () => createMatchRecordQuarterSections(quarterCount),
    [quarterCount],
  );

  const groupedEvents = useMemo(
    () => getGroupedMatchRecordEvents(events, quarterCount),
    [events, quarterCount],
  );

  const selfMatchPlayersBySide = useMemo(
    () => getSelfMatchPlayersBySide(attendPlayers, votes),
    [attendPlayers, votes],
  );

  return {
    quarterSections,
    groupedEvents,
    selfMatchPlayersBySide,
  };
}
