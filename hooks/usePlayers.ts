"use client";

import { useEffect, useRef, useState } from "react";
import type { Playertype } from "@/types/player";

const defaultPlayers: Playertype[] = [
  {
    id: "1",
    name: "손흥민",
    position: "FW",
    number: 7,
    birth: "1998.12.26",
    appearance: 9,
    goal: 5,
  },
];

export function usePlayers() {
  const didLoad = useRef(false);
  const [players, setPlayers] = useState<Playertype[]>(defaultPlayers);

  useEffect(() => {
    const saved = localStorage.getItem("players");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayers(JSON.parse(saved));
    }

    didLoad.current = true;
  }, []);

  useEffect(() => {
    if (!didLoad.current) return;

    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  return { players, setPlayers };
}
