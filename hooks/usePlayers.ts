import { PlayerType } from "@/types/player";
import { useEffect, useState } from "react";

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("players");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayers(JSON.parse(saved));
    }
    setPlayersLoaded(true);
  }, []);

  useEffect(() => {
    if (!playersLoaded) return;

    localStorage.setItem("players", JSON.stringify(players));
  }, [players, playersLoaded]);

  return { players, setPlayers, playersLoaded };
}
