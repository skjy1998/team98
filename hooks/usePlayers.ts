import { PlayerType } from "@/types/player";
import { useEffect, useState } from "react";

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("players");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayers(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("players", JSON.stringify(players));
  }, [players, loaded]);

  return { players, setPlayers, loaded };
}
