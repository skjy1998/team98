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

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            자체전 팀 배정
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            참석 선수를 A팀과 B팀으로 나눠 주세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
            A팀 {teamACount}명
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">
            B팀 {teamBcount}명
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-600">
            미배정 {unassignedCount}명
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {players.map((player) => {
          const currentSide = votes.find(
            (vote) => vote.playerId === player.id,
          )?.side;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-4"
            >
              <p className="font-semibold text-stone-900">{player.name}</p>

              <div className="flex items-center gap-2">
                {sideOptions.map((option) => {
                  const isActive = currentSide === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!canManage}
                      onClick={() =>
                        onChangeSide(player.id, isActive ? null : option.value)
                      }
                      className={[
                        "rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
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
