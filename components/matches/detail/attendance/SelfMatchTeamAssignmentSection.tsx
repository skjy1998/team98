import type { SelfMatchSide } from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";

interface SelfMatchTeamAssignmentSectionProps {
  players: PlayerType[];
  votes: MatchVote[];
  canManage: boolean;
  onChangeSide: (playerId: string, side: SelfMatchSide | null) => void;
}

const sideOptions: {
  value: SelfMatchSide;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "team_a",
    label: "A팀",
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "team_b",
    label: "B팀",
    activeClassName: "bg-sky-600 text-white",
  },
];

export default function SelfMatchTeamAssignmentSection({
  players,
  votes,
  canManage,
  onChangeSide,
}: Readonly<SelfMatchTeamAssignmentSectionProps>) {
  const teamACount = votes.filter(
    (vote) => vote.status === "attend" && vote.side === "team_a",
  ).length;

  const teamBcount = votes.filter(
    (vote) => vote.status === "attend" && vote.side === "team_b",
  ).length;

  const unassignedCount = players.length - teamACount - teamBcount;

  const voteByPlayerId = new Map(votes.map((vote) => [vote.playerId, vote]));

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            자체전 팀 배정
          </h2>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            참석 선수를 A팀과 B팀으로 나눠 주세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold sm:gap-2 sm:text-xs">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 sm:px-3 sm:py-1.5">
            A팀 {teamACount}명
          </span>
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 sm:px-3 sm:py-1.5">
            B팀 {teamBcount}명
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-600 sm:px-3 sm:py-1.5">
            미배정 {unassignedCount}명
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
        {players.map((player) => {
          const currentSide = voteByPlayerId.get(player.id)?.side;

          return (
            <div
              key={player.id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4"
            >
              <p className="min-w-0 truncate text-sm font-semibold text-stone-900 sm:text-base">
                {player.name}
              </p>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {sideOptions.map((option) => {
                  const isActive = currentSide === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isActive}
                      disabled={!canManage}
                      onClick={() =>
                        onChangeSide(player.id, isActive ? null : option.value)
                      }
                      className={[
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm",
                        isActive
                          ? option.activeClassName
                          : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
