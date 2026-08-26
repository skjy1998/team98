"use client";

import type { MatchRecordEvent, MatchRecordEventType } from "@/types/match";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import {
  createMatchRecordEvent,
  getMatchRecordEvents,
  removeMatchRecordEvent,
  updateMatchRecordEvent,
  updateMatchRecordOrder,
} from "@/lib/matches/match-record-repository";

export function useMatchRecords(matchId: string) {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [events, setEvents] = useState<MatchRecordEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  const loadRecords = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId || !matchId) {
      setEvents([]);
      setLoaded(true);
      setRecordsError("");
      return;
    }

    setLoaded(false);
    setRecordsError("");

    try {
      const nextEvents = await getMatchRecordEvents(teamId, matchId);
      setEvents(nextEvents);
    } catch (error) {
      console.error("match records load error", error);
      setEvents([]);
      setRecordsError("경기 기록을 불러오지 못했어요.");
    } finally {
      setLoaded(true);
    }
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

    try {
      const createdEvent = await createMatchRecordEvent(
        teamId,
        matchId,
        type,
        events.length,
      );

      setEvents((currentEvents) => [...currentEvents, createdEvent]);
      return true;
    } catch (error) {
      console.error("match record create error", error);
      return false;
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!teamId || !matchId) return false;

    try {
      await removeMatchRecordEvent(teamId, matchId, eventId);

      setEvents((currentsEvents) =>
        currentsEvents.filter((event) => event.id !== eventId),
      );

      return true;
    } catch (error) {
      console.error("match record delete error", error);
      return false;
    }
  };

  const updateEvent = async (
    eventId: string,
    updates: Partial<MatchRecordEvent>,
  ) => {
    if (!teamId || !matchId) return false;

    try {
      const updatedEvent = await updateMatchRecordEvent(
        teamId,
        matchId,
        eventId,
        updates,
      );

      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId ? updatedEvent : event,
        ),
      );

      return true;
    } catch (error) {
      console.error("match record update error", error);
      return false;
    }
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

    try {
      await updateMatchRecordOrder(teamId, matchId, nextEvents);
      return true;
    } catch (error) {
      console.error("match record reorder error", error);
      await loadRecords();
      return false;
    }
  };

  return {
    loaded,
    recordsError,
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
