import type { VoteStatus } from "@/types/match-vote";
import { CircleHelp, Clock3, UserRoundCheck, UserRoundX } from "lucide-react";

interface MyVoteCardProps {
  playerId: string;
  status: VoteStatus;
  deadlineText: string;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

const statusMeta: Record<
  VoteStatus,
  {
    label: string;
    badgeClassName: string;
    cardClassName: string;
    icon: typeof UserRoundCheck;
  }
> = {
  attend: {
    label: "참석",
    badgeClassName: "bg-emerald-100 text-emerald-700",
    cardClassName: "bg-emerald-600 text-white",
    icon: UserRoundCheck,
  },
  pending: {
    label: "미정",
    badgeClassName: "bg-amber-100 text-amber-700",
    cardClassName: "bg-amber-500 text-white",
    icon: CircleHelp,
  },
  absent: {
    label: "불참",
    badgeClassName: "bg-rose-100 text-rose-700",
    cardClassName: "bg-rose-600 text-white",
    icon: UserRoundX,
  },
};

const voteOptions: VoteStatus[] = ["attend", "pending", "absent"];

export default function MyVoteCard({
  playerId,
  status,
  deadlineText,
  onChangeStatus,
}: Readonly<MyVoteCardProps>) {
  const currentStatus = statusMeta[status];

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">내 투표</h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
            <Clock3 className="h-4 w-4" />
            <span>마감: {deadlineText}</span>
          </div>
        </div>

        <span
          className={`rounded-xl px-3 py-2 text-sm font-semibold ${currentStatus.badgeClassName}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {voteOptions.map((option) => {
          const meta = statusMeta[option];
          const isActive = status === option;
          const Icon = meta.icon;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChangeStatus(playerId, option)}
              className={`relative rounded-2xl px-4 py-6 transition ${
                isActive
                  ? meta.cardClassName
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {isActive && (
                <span className="absolute right-4 top-4 text-lg font-semibold">
                  ✓
                </span>
              )}

              <div className="flex flex-col items-center justify-center">
                <Icon className="h-7 w-7" />
                <span className="mt-3 text-lg font-semibold">{meta.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
