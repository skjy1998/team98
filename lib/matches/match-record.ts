import { MatchRecordEvent, MatchRecordQuarter } from "@/types/match";
import { MatchVotesByMatchId } from "@/types/match-vote";
import { PlayerType } from "@/types/player";

export interface MatchRecordQuarterSectionItem {
  key: "1Q" | "2Q" | "3Q" | "4Q" | "unknown";
  label: string;
}

export interface EditingRecordForm {
  eventId: string | null;
  playerId: string;
  assistPlayerId: string;
  quarter: MatchRecordQuarter;
  minute: string;
}

export const defaultEditingRecordForm: EditingRecordForm = {
  eventId: null,
  playerId: "",
  assistPlayerId: "",
  quarter: "unknown",
  minute: "",
};

export const quarterSections: MatchRecordQuarterSectionItem[] = [
  { key: "1Q", label: "1Q" },
  { key: "2Q", label: "2Q" },
  { key: "3Q", label: "3Q" },
  { key: "4Q", label: "4Q" },
  { key: "unknown", label: "쿼터 모름" },
];

export function getGroupedMatchRecordEvents(events: MatchRecordEvent[]) {
  return {
    "1Q": events.filter((event) => event.quarter === "1Q"),
    "2Q": events.filter((event) => event.quarter === "2Q"),
    "3Q": events.filter((event) => event.quarter === "3Q"),
    "4Q": events.filter((event) => event.quarter === "4Q"),
    unknown: events.filter(
      (event) => !event.quarter || event.quarter === "unknown",
    ),
  };
}

export function getAttendPlayerIdsByVotes(
  votes: MatchVotesByMatchId,
  matchId: string,
) {
  const currentVotes = votes[matchId] ?? [];

  return new Set(
    currentVotes
      .filter((vote) => vote.status === "attend")
      .map((vote) => vote.playerId),
  );
}

export function getAttendPlayers(
  players: PlayerType[],
  attendPlayerIds: Set<string>,
) {
  return players.filter((player) => attendPlayerIds.has(player.id));
}

export function getPlayersAfterRecordEdit(
  players: PlayerType[],
  prevEvent: MatchRecordEvent,
  nextEvent: {
    playerId: string;
    assistPlayerId: string;
  },
) {
  return players.map((player) => {
    let nextGoal = player.goal;
    let nextAssist = player.assist;

    if (prevEvent.type === "goal" && prevEvent.playerId === player.id) {
      nextGoal -= 1;
    }

    if (
      prevEvent.type === "goal" &&
      prevEvent.assistPlayerId &&
      prevEvent.assistPlayerId === player.id
    ) {
      nextAssist -= 1;
    }

    if (prevEvent.type === "goal" && nextEvent.playerId === player.id) {
      nextGoal += 1;
    }

    if (
      prevEvent.type === "goal" &&
      nextEvent.assistPlayerId &&
      nextEvent.assistPlayerId === player.id
    ) {
      nextAssist += 1;
    }

    return {
      ...player,
      goal: Math.max(0, nextGoal),
      assist: Math.max(0, nextAssist),
    };
  });
}

export function getPlayersAfterRecordDelete(
  players: PlayerType[],
  event: MatchRecordEvent,
) {
  if (event.type !== "goal") {
    return players;
  }

  return players.map((player) => {
    let nextGoal = player.goal;
    let nextAssist = player.assist;

    if (event.playerId === player.id) {
      nextGoal -= 1;
    }

    if (event.assistPlayerId && event.assistPlayerId === player.id) {
      nextAssist -= 1;
    }

    return {
      ...player,
      goal: Math.max(0, nextGoal),
      assist: Math.max(0, nextAssist),
    };
  });
}
