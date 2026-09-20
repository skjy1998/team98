import type { VoteStatus } from "@/types/match-vote";
import {
  Check,
  CircleHelp,
  Clock3,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

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
  unvoted: {
    label: "미투표",
    badgeClassName: "bg-stone-100 text-stone-600",
    cardClassName: "bg-stone-400 text-white",
    icon: CircleHelp,
  },
};

const voteOptions = ["attend", "pending", "absent"] as const;

export default function MyVoteCard({
  playerId,
  status,
  deadlineText,
  onChangeStatus,
}: Readonly<MyVoteCardProps>) {
  const currentStatus = statusMeta[status];

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            내 투표
          </h2>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 sm:mt-3 sm:gap-2 sm:text-sm">
            <Clock3 className="h-4 w-4" />
            <span>마감: {deadlineText}</span>
          </div>
        </div>

        <span
          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${currentStatus.badgeClassName}`}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
        {voteOptions.map((option) => {
          const meta = statusMeta[option];
          const isActive = status === option;
          const Icon = meta.icon;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChangeStatus(playerId, option)}
              className={`relative rounded-xl px-2 py-4 transition active:scale-[0.98] sm:rounded-2xl sm:px-4 sm:py-6 ${
                isActive
                  ? meta.cardClassName
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {isActive && (
                <Check
                  aria-hidden="true"
                  className="absolute right-2 top-2 h-4 w-4 stroke-[3] sm:right-4 sm:top-4 sm:h-5 sm:w-5"
                />
              )}

              <div className="flex flex-col items-center justify-center">
                <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                <span className="mt-2 text-sm font-semibold sm:mt-3 sm:text-lg">
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
