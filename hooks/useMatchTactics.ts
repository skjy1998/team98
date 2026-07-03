import { createDefaultMatchTactics } from "@/lib/tactics-ui";
import type { MatchTacticsByQuarter } from "@/types/tactics";
import { useEffect, useState } from "react";

export function useMatchTactics(matchId: string) {
  const storageKey = `match-tactics-${matchId}`;
  const [tacticsByQuarter, setTacticsByQuarter] =
    useState<MatchTacticsByQuarter>(createDefaultMatchTactics());
  const [tacticsLoaded, setTacticsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved && saved !== "undefined") {
      try {
        const parsed = JSON.parse(saved) as Partial<MatchTacticsByQuarter>;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTacticsByQuarter({
          ...createDefaultMatchTactics(),
          ...parsed,
        });
      } catch {
        localStorage.removeItem(storageKey);
      }
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
    tacticsLoaded,
  };
}
