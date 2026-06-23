import { createDefaultMatchTactics } from "@/lib/tactics-ui";
import { MatchTacticsByQuarter } from "@/types/tactics";
import { useEffect, useState } from "react";

export function useMatchTactics(matchId: string) {
  const [tacticsByQuarter, setTacticsByQuarter] =
    useState<MatchTacticsByQuarter>(createDefaultMatchTactics());
  const [tacticsLoaded, setTacticsLoaded] = useState(false);
  const storageKey = `match-tactics-${matchId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed = JSON.parse(saved) as Partial<MatchTacticsByQuarter>;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTacticsByQuarter({
        ...createDefaultMatchTactics(),
        ...parsed,
      });
    }

    setTacticsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!tacticsLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(tacticsByQuarter));
  }, [storageKey, tacticsByQuarter, tacticsLoaded]);

  return {
    tacticsByQuarter,
    setTacticsByQuarter,
  };
}
