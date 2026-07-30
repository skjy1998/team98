export function removeMatchRecords(matchId: string) {
  const savedRecords = localStorage.getItem("match-records");

  if (savedRecords && savedRecords !== "undefined") {
    try {
      const parsedRecords = JSON.parse(savedRecords) as Record<string, unknown>;
      delete parsedRecords[matchId];
      localStorage.setItem("match-records", JSON.stringify(parsedRecords));
    } catch {
      localStorage.removeItem("match-records");
    }
  }
}

export function removeMatchVotes(matchId: string) {
  const savedVotes = localStorage.getItem("match-votes");

  if (savedVotes && savedVotes !== "undefined") {
    try {
      const parsedVotes = JSON.parse(savedVotes) as Record<string, unknown>;
      delete parsedVotes[matchId];
      localStorage.setItem("match-votes", JSON.stringify(parsedVotes));
    } catch {
      localStorage.removeItem("match-votes");
    }
  }
}
