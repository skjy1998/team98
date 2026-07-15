import type { VoteStatus } from "@/types/match-vote";

interface VoteMemberRowProps {
  id: string;
  name: string;
  status: VoteStatus;
  canEdit: boolean;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

const statusOptions = [
  {
    value: "attend",
    label: "참석",
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "pending",
    label: "미정",
    activeClassName: "bg-amber-500 text-white",
  },
  {
    value: "absent",
    label: "불참",
    activeClassName: "bg-rose-600 text-white",
  },
] as const;

const readOnlyStatusClassName: Record<VoteStatus, string> = {
  attend: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  absent: "bg-rose-100 text-rose-700",
  unvoted: "bg-stone-100 text-stone-600",
};

const readOnlyStatusLabel: Record<VoteStatus, string> = {
  attend: "참석",
  pending: "미정",
  absent: "불참",
  unvoted: "미투표",
};

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
          {statusOptions.map((option) => {
            const isActive = status === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeStatus(id, option.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  isActive
                    ? option.activeClassName
                    : "border border-stone-200 bg-white text-stone-600"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${readOnlyStatusClassName[status]}`}
        >
          {readOnlyStatusLabel[status]}
        </span>
      )}
    </div>
  );
}
