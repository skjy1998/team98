import { getPlayerVoteStatus } from "@/lib/matches/match-vote";
import { useToastStore } from "@/stores/toast-store";
import type { MatchVote, VoteStatus } from "@/types/match-vote";

interface UseMatchVoteTabActionsParams {
  matchId: string;
  votes: MatchVote[];
  saveVote: (
    matchId: string,
    playerId: string,
    status: VoteStatus,
  ) => Promise<boolean>;
  deleteVote: (matchId: string, playerId: string) => Promise<boolean>;
}

export function useMatchVoteTabActions({
  matchId,
  votes,
  saveVote,
  deleteVote,
}: UseMatchVoteTabActionsParams) {
  const showToast = useToastStore((state) => state.showToast);

  const handleChangeStatus = async (playerId: string, status: VoteStatus) => {
    const currentStatus = getPlayerVoteStatus(votes, playerId);

    const success =
      currentStatus === status
        ? await deleteVote(matchId, playerId)
        : await saveVote(matchId, playerId, status);

    if (!success) {
      showToast("투표 저장에 실패했어요.", "error");
    }
  };

  return { handleChangeStatus };
}
