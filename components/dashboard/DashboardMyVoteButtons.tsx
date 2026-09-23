import { useToastStore } from "@/stores/toast-store";
import type { VoteStatus } from "@/types/match-vote";
import { CircleHelp, UserRoundCheck, UserRoundX } from "lucide-react";
import { useState } from "react";

interface DashboardMyVoteButtonsProps {
  matchId: string;
  status: VoteStatus;
  deadlineText: string;
  onChangeStatus: (matchId: string, status: VoteStatus) => Promise<boolean>;
}

const voteOptions = [
  {
    status: "attend",
    label: "참석",
    icon: UserRoundCheck,
    activeClassName: "border-emerald-400 bg-emerald-500 text-white",
  },
  {
    status: "pending",
    label: "미정",
    icon: CircleHelp,
    activeClassName: "border-amber-400 bg-amber-400 text-white",
  },
  {
    status: "absent",
    label: "불참",
    icon: UserRoundX,
    activeClassName: "border-rose-400 bg-rose-500 text-white",
  },
] satisfies Array<{
  status: VoteStatus;
  label: string;
  icon: typeof UserRoundCheck;
  activeClassName: string;
}>;

export default function DashboardMyVoteButtons({
  matchId,
  status,
  deadlineText,
  onChangeStatus,
}: Readonly<DashboardMyVoteButtonsProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const handleChangeStatus = async (nextStatus: VoteStatus) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const success = await onChangeStatus(matchId, nextStatus);
    setIsSubmitting(false);

    if (!success) {
      showToast("투표 저장에 실패했어요.", "error");
    }
  };

  return (
    <div className="mt-4 border-t border-dashed border-stone-200 pt-4 sm:mt-5 sm:pt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-stone-700 sm:text-sm">
          내 참석 여부
        </p>
        <p className="text-[11px] text-stone-400 sm:text-xs">
          마감: {deadlineText}
        </p>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
        {voteOptions.map((option) => {
          const Icon = option.icon;
          const isActive = status === option.status;

          return (
            <button
              key={option.status}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleChangeStatus(option.status)}
              className={`flex h-10 items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:gap-2 sm:rounded-xl sm:text=sm ${
                isActive
                  ? option.activeClassName
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
