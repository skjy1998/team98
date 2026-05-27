import { MatchItem } from "@/types/match";
import { useEffect, useState } from "react";

export function useMatches() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);

  useEffect(() => {
    const savedMatches = localStorage.getItem("matches");

    if (savedMatches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(JSON.parse(savedMatches));
    }
    setMatchesLoaded(true);
  }, []);

  useEffect(() => {
    if (!matchesLoaded) return;
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches, matchesLoaded]);

  return {
    matches,
    setMatches,
    matchesLoaded,
  };
}
