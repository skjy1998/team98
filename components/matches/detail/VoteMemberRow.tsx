import { VoteStatus } from "@/types/match-vote";

interface VoteMemberRowProps {
  id: string;
  name: string;
  status: VoteStatus;
  onChangeStatus: (playerId: string, status: VoteStatus) => void;
}

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
        <button
          type="button"
          onClick={() => onChangeStatus(id, "attend")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            status === "attend"
              ? "bg-emerald-600 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          참석
        </button>
        <button
          type="button"
          onClick={() => onChangeStatus(id, "pending")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            status === "pending"
              ? "bg-amber-500 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          미정
        </button>
        <button
          type="button"
          onClick={() => onChangeStatus(id, "absent")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            status === "absent"
              ? "bg-rose-500 text-white"
              : "border border-stone-200 bg-white text-stone-600"
          }`}
        >
          불참
        </button>
      </div>
    </div>
  );
}
