import {
  canUserVoteForMatchMvp,
  getCurrentUserMvpVote,
  getMatchMvpSummary,
} from "@/lib/matches/match-mvp";
import { useToastStore } from "@/stores/toast-store";
import type { MatchAttendance } from "@/types/match-attendance";
import type { MatchMvpVote } from "@/types/match-mvp";
import type { PlayerType } from "@/types/player";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface MatchMvpTabProps {
  matchId: string;
  players: PlayerType[];
  attendance: MatchAttendance[];
  votes: MatchMvpVote[];
  currentUserId?: string;
  hasMatchEnded: boolean;
  saveMvpVote: (matchId: string, candidatePlayerId: string) => Promise<boolean>;
  deleteMvpVote: (matchId: string) => Promise<boolean>;
  isCanceled: boolean;
}

export default function MatchMvpTab({
  matchId,
  players,
  attendance,
  votes,
  currentUserId,
  hasMatchEnded,
  saveMvpVote,
  deleteMvpVote,
  isCanceled,
}: Readonly<MatchMvpTabProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = getMatchMvpSummary(players, attendance, votes);
  const winnerNames = summary.candidates
    .filter((candidate) => candidate.isWinner)
    .map((candidate) => candidate.playerName);
  const currentVote = getCurrentUserMvpVote(votes, currentUserId);
  const canVote = canUserVoteForMatchMvp(players, attendance, currentUserId);

  const handleVote = async (playerId: string) => {
    if (isSubmitting || isCanceled || !hasMatchEnded || !canVote) return;

    const isCanceling = currentVote?.candidatePlayerId === playerId;

    setIsSubmitting(true);

    const success = isCanceling
      ? await deleteMvpVote(matchId)
      : await saveMvpVote(matchId, playerId);

    setIsSubmitting(false);

    if (!success) {
      showToast("MVP 투표 저장에 실패했어요.", "error");
      return;
    }

    showToast(
      isCanceling ? "MVP 투표를 취소했어요." : "MVP 투표를 저장했어요.",
      "success",
    );
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">경기 MVP</h2>
          <p className="mt-2 text-sm text-stone-500">
            실제 경기에 참석한 선수 중 MVP를 선택할 수 있어요.
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 px-4 py-2 text-right">
          <p className="text-xs font-semibold text-amber-600">총 투표</p>
          <p className="text-xl font-bold text-amber-900">
            {summary.totalVotes}
          </p>
        </div>
      </div>

      {summary.totalVotes > 0 && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Trophy className="h-4 w-4" aria-hidden="true" />
          </span>

          <p className="min-w-0 text-sm text-amber-900">
            현재 1위는{" "}
            <strong className="font-bold">{winnerNames.join(", ")}</strong>
            선수입니다.
          </p>
        </div>
      )}

      {isCanceled && (
        <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
          취소된 경기는 MVP 투표를 진행할 수 없어요.
        </p>
      )}

      {!isCanceled && !hasMatchEnded && (
        <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
          경기가 종료된 후 MVP 투표가 열려요.
        </p>
      )}

      {!isCanceled && hasMatchEnded && !canVote && (
        <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
          실제 출석 또는 지각 처리된 선수만 투표할 수 있어요.
        </p>
      )}

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {summary.candidates.map((candidate) => {
          const isSelected =
            currentVote?.candidatePlayerId === candidate.playerId;

          return (
            <button
              key={candidate.playerId}
              type="button"
              disabled={
                isCanceled || !hasMatchEnded || !canVote || isSubmitting
              }
              onClick={() => handleVote(candidate.playerId)}
              className={[
                "flex min-w-0 items-center justify-between rounded-xl border px-3 py-3 text-left transition",
                isSelected
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-stone-200 hover:border-emerald-200 hover:bg-stone-50",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    candidate.isWinner
                      ? "bg-amber-100 text-amber-600"
                      : "bg-stone-100 text-stone-500",
                  ].join(" ")}
                >
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                </span>

                <span className="truncate text-sm font-semibold text-stone-900">
                  {candidate.playerName}
                </span>
              </span>

              <span className="ml-2 shrink-0 text-xs font-semibold text-stone-500">
                {candidate.voteCount}표
              </span>
            </button>
          );
        })}
      </div>

      {summary.candidates.length === 0 && (
        <p className="mt-6 rounded-xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
          출석 처리된 MVP 후보가 없어요.
        </p>
      )}
    </section>
  );
}
