import { MatchVotesByMatchId } from "@/types/match-vote";
import { useEffect, useState } from "react";

export function useMatchVotes() {
  const [votes, setVotes] = useState<MatchVotesByMatchId>({});
  const [votesLoaded, setVotesLoaded] = useState(false);

  // match-votes를 불러오는 역할
  useEffect(() => {
    const savedVotes = localStorage.getItem("match-votes");

    if (savedVotes && savedVotes !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVotes(JSON.parse(savedVotes));
      } catch {
        localStorage.removeItem("match-votes");
      }
    }

    setVotesLoaded(true);
  }, []);

  useEffect(() => {
    if (!votesLoaded) return;
    localStorage.setItem("match-votes", JSON.stringify(votes));
  }, [votes, votesLoaded]);

  return { votes, setVotes, votesLoaded };
}
