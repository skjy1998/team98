"use client";

import { useEffect, useMemo, useState } from "react";

export type MatchRecordEventType = "goal" | "concede";

export interface MatchRecordEvent {
  id: string;
  type: MatchRecordEventType;
  playerId?: string;
  playerName?: string;
  minute?: string;
}

type MatchRecordMap = Record<string, MatchRecordEvent[]>;

export function useMatchRecords(matchId: string) {
  const [records, setRecords] = useState<MatchRecordMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("match-records");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecords(JSON.parse(saved));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("match-records", JSON.stringify(records));
  }, [records, loaded]);

  const events = useMemo(() => {
    return records[matchId] ?? [];
  }, [records, matchId]);

  const ourScore = useMemo(() => {
    return events.filter((event) => event.type === "goal").length;
  }, [events]);

  const opponentScore = useMemo(() => {
    return events.filter((event) => event.type === "concede").length;
  }, [events]);

  const addEvent = (type: MatchRecordEventType) => {
    setRecords((prev) => {
      const prevEvents = prev[matchId] ?? [];

      return {
        ...prev,
        [matchId]: [
          ...prevEvents,
          {
            id: crypto.randomUUID(),
            type,
          },
        ],
      };
    });
  };

  const deleteEvent = (eventId: string) => {
    setRecords((prev) => {
      const prevEvents = prev[matchId] ?? [];

      return {
        ...prev,
        [matchId]: prevEvents.filter((event) => event.id !== eventId),
      };
    });
  };

  const updateEvent = (eventId: string, updates: Partial<MatchRecordEvent>) => {
    setRecords((prev) => {
      const prevEvents = prev[matchId] ?? [];

      return {
        ...prev,
        [matchId]: prevEvents.map((event) =>
          event.id === eventId ? { ...event, ...updates } : event,
        ),
      };
    });
  };

  return {
    loaded,
    events,
    ourScore,
    opponentScore,
    addEvent,
    deleteEvent,
    updateEvent,
  };
}
