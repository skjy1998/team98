import { initialMatches } from "@/data/initialMatches";
import { MatchType } from "@/types/match";
import { useEffect, useState } from "react";

export function useMatches() {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("matches");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(JSON.parse(saved));
    } else {
      setMatches(initialMatches);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches, loaded]);

  return { matches, setMatches, loaded };
}
