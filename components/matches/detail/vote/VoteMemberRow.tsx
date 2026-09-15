import type { VoteStatus } from "@/types/match-vote";

interface VoteMemberRowProps {
  id: string;
  name: string;
  status: VoteStatus;
  canEdit: boolean;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

const selectableStatuses = ["attend", "pending", "absent"] as const;

const statusMeta = {
  attend: {
    label: "참석",
    activeClassName: "bg-emerald-600 text-white",
    readOnlyClassName: "bg-emerald-100 text-emerald-700",
  },
  pending: {
    label: "미정",
    activeClassName: "bg-amber-500 text-white",
    readOnlyClassName: "bg-amber-100 text-amber-700",
  },
  absent: {
    label: "불참",
    activeClassName: "bg-rose-600 text-white",
    readOnlyClassName: "bg-rose-100 text-rose-700",
  },
  unvoted: {
    label: "미투표",
    activeClassName: "",
    readOnlyClassName: "bg-stone-100 text-stone-600",
  },
} satisfies Record<
  VoteStatus,
  {
    label: string;
    activeClassName: string;
    readOnlyClassName: string;
  }
>;

export default function VoteMemberRow({
  id,
  name,
  status,
  canEdit,
  onChangeStatus,
}: Readonly<VoteMemberRowProps>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-4">
      <p className="text-base font-semibold text-stone-900">{name}</p>
      {canEdit ? (
        <div className="flex items-center gap-2">
          {selectableStatuses.map((optionStatus) => {
            const option = statusMeta[optionStatus];
            const isActive = status === optionStatus;

            return (
              <button
                key={optionStatus}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChangeStatus(id, optionStatus)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? option.activeClassName
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMeta[status].readOnlyClassName}`}
        >
          {statusMeta[status].label}
        </span>
      )}
    </div>
  );
}
