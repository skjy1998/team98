import type { VoteStatus } from "@/types/match-vote";

interface VoteMemberRowProps {
  id: string;
  name: string;
  status: VoteStatus;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

const statusOptions: {
  value: VoteStatus;
  label: string;
  activeClassName: string;
}[] = [
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
];

export default function VoteMemberRow({
  id,
  name,
  status,
  onChangeStatus,
}: Readonly<VoteMemberRowProps>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-4">
      <p className="text-base font-semibold text-stone-900">{name}</p>
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
    </div>
  );
}
