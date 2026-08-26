import type { MatchRecordEvent, MatchRecordQuarter } from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import { createQuarterOptions } from "./match-quarter";

export interface MatchRecordQuarterSectionItem {
  key: MatchRecordQuarter;
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

export function createMatchRecordQuarterSections(
  quarterCount: number,
): MatchRecordQuarterSectionItem[] {
  const quarterSections = createQuarterOptions(quarterCount).map((quarter) => ({
    key: quarter as MatchRecordQuarter,
    label: quarter,
  }));

  return [
    ...quarterSections,
    {
      key: "unknown",
      label: "쿼터 모름",
    },
  ];
}

export function getGroupedMatchRecordEvents(
  events: MatchRecordEvent[],
  quarterCount: number,
) {
  const sections = createMatchRecordQuarterSections(quarterCount);
  const validQuarters = new Set<string>(createQuarterOptions(quarterCount));

  const groupedEvents: Record<string, MatchRecordEvent[]> = {};

  sections.forEach((section) => {
    groupedEvents[section.key] = [];
  });

  events.forEach((event) => {
    const eventQuarter = event.quarter;

    const targetQuarter =
      eventQuarter &&
      eventQuarter !== "unknown" &&
      validQuarters.has(eventQuarter)
        ? eventQuarter
        : "unknown";

    groupedEvents[targetQuarter] ??= [];
    groupedEvents[targetQuarter].push(event);
  });

  return groupedEvents;
}

export function getSelfMatchPlayersBySide(
  attendPlayers: PlayerType[],
  votes: MatchVote[],
) {
  const teamAPlayerIds = new Set(
    votes
      .filter((vote) => vote.status === "attend" && vote.side === "team_a")
      .map((vote) => vote.playerId),
  );

  const teamBPlayerIds = new Set(
    votes
      .filter((vote) => vote.status === "attend" && vote.side === "team_b")
      .map((vote) => vote.playerId),
  );

  return {
    team_a: attendPlayers.filter((player) => teamAPlayerIds.has(player.id)),
    team_b: attendPlayers.filter((player) => teamBPlayerIds.has(player.id)),
  };
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
