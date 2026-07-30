"use client";

import {
  MatchRecordEvent,
  MatchRecordEventType,
  MatchRecordQuarter,
} from "@/types/match";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { supabase } from "@/lib/supabase";

type MatchRecordRow = {
  id: string;
  type: MatchRecordEventType;
  player_id: string | null;
  player_name: string | null;
  assist_player_id: string | null;
  assist_player_name: string | null;
  minute: string | null;
  quarter: MatchRecordQuarter;
  sort_order: number;
};

function mapMatchRecordRow(row: MatchRecordRow): MatchRecordEvent {
  return {
    id: row.id,
    type: row.type,
    playerId: row.player_id ?? "",
    playerName: row.player_name ?? "",
    assistPlayerId: row.assist_player_id ?? "",
    assistPlayerName: row.assist_player_name ?? "",
    minute: row.minute ?? "",
    quarter: row.quarter ?? "unknown",
  };
}

export function useMatchRecords(matchId: string) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [events, setEvents] = useState<MatchRecordEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId || !matchId) {
      setEvents([]);
      setLoaded(true);
      return;
    }

    setLoaded(false);

    const { data, error } = await supabase
      .from("match_records")
      .select(
        "id, type, player_id, player_name, assist_player_id, assist_player_name, minute, quarter, sort_order",
      )
      .eq("team_id", teamId)
      .eq("match_id", matchId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      setEvents([]);
      setLoaded(true);
      return;
    }

    setEvents(data.map((row) => mapMatchRecordRow(row as MatchRecordRow)));
    setLoaded(true);
  }, [teamLoaded, teamId, matchId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords();
  }, [loadRecords]);

  const ourScore = useMemo(() => {
    return events.filter((event) => event.type === "goal").length;
  }, [events]);

  const opponentScore = useMemo(() => {
    return events.filter((event) => event.type === "concede").length;
  }, [events]);

  const addEvent = async (type: MatchRecordEventType) => {
    if (!teamId || !matchId) return false;

    const nextSortOrder = events.length;

    const { data, error } = await supabase
      .from("match_records")
      .insert({
        team_id: teamId,
        match_id: matchId,
        type,
        player_id: null,
        player_name: "",
        assist_player_id: null,
        assist_player_name: "",
        minute: "",
        quarter: "unknown",
        sort_order: nextSortOrder,
      })
      .select(
        "id, type, player_id, player_name, assist_player_id, assist_player_name, minute, quarter, sort_order",
      )
      .single();

    if (error || !data) {
      return false;
    }

    setEvents((prev) => [...prev, mapMatchRecordRow(data as MatchRecordRow)]);
    return true;
  };

  const deleteEvent = async (eventId: string) => {
    if (!teamId || !matchId) return false;

    const { error } = await supabase
      .from("match_records")
      .delete()
      .eq("id", eventId)
      .eq("team_id", teamId)
      .eq("match_id", matchId);

    if (error) return false;

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    return true;
  };

  const updateEvent = async (
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => {
    if (!teamId || !matchId) return false;

    const { data, error } = await supabase
      .from("match_records")
      .update({
        player_id: updates.playerId || null,
        player_name: updates.playerName ?? "",
        assist_player_id: updates.assistPlayerId || null,
        assist_player_name: updates.assistPlayerName ?? "",
        minute: updates.minute ?? "",
        quarter: updates.quarter ?? "unknown",
      })
      .eq("id", eventId)
      .eq("team_id", teamId)
      .eq("match_id", matchId)
      .select(
        "id, type, player_id, player_name, assist_player_id, assist_player_name, minute, quarter, sort_order",
      )
      .single();

    if (error || !data) {
      return false;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? mapMatchRecordRow(data as MatchRecordRow)
          : event,
      ),
    );
    return true;
  };

  const reorderEvents = async (activeId: string, overId: string) => {
    if (!teamId || !matchId) return false;

    const oldIndex = events.findIndex((event) => event.id === activeId);
    const newIndex = events.findIndex((event) => event.id === overId);

    if (oldIndex === -1 || newIndex === -1) {
      return false;
    }

    const nextEvents = [...events];
    const [movedEvent] = nextEvents.splice(oldIndex, 1);
    nextEvents.splice(newIndex, 0, movedEvent);

    setEvents(nextEvents);

    const results = await Promise.all(
      nextEvents.map((event, index) =>
        supabase
          .from("match_records")
          .update({ sort_order: index })
          .eq("id", event.id)
          .eq("team_id", teamId)
          .eq("match_id", matchId),
      ),
    );

    if (results.some((result) => result.error)) {
      await loadRecords();
      return false;
    }

    return true;
  };

  return {
    loaded,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
    reorderEvents,
    reloadRecords: loadRecords,
  };
}
