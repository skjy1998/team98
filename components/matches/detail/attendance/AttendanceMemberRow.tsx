import type { MatchAttendanceStatus } from "@/types/match-attendance";

interface AttendanceMemberRowProps {
  id: string;
  name: string;
  status: MatchAttendanceStatus | "unchecked";
  canEdit: boolean;
  onChangeStatus: (
    playerId: string,
    status: MatchAttendanceStatus | "unchecked",
  ) => void;
}

const statusOptions = [
  {
    value: "attend",
    label: "출석",
    activeClassName: "bg-emerald-600 text-white",
  },
  {
    value: "late",
    label: "지각",
    activeClassName: "bg-amber-500 text-white",
  },
  {
    value: "absent",
    label: "무단불참",
    activeClassName: "bg-rose-600 text-white",
  },
] as const;

const readOnlyStatusClassName: Record<
  MatchAttendanceStatus | "unchecked",
  string
> = {
  attend: "bg-emerald-100 text-emerald-700",
  late: "bg-amber-100 text-amber-700",
  absent: "bg-rose-100 text-rose-700",
  unchecked: "bg-stone-100 text-stone-600",
};

const readOnlyStatusLabel: Record<MatchAttendanceStatus | "unchecked", string> =
  {
    attend: "출석",
    late: "지각",
    absent: "무단불참",
    unchecked: "미체크",
  };

export default function AttendanceMemberRow({
  id,
  name,
  status,
  canEdit,
  onChangeStatus,
}: Readonly<AttendanceMemberRowProps>) {
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
                onClick={() =>
                  onChangeStatus(id, isActive ? "unchecked" : option.value)
                }
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
          className={`rounded-full px-3 py-1 text-sm font-semibold ${readOnlyStatusClassName[status]}`}
        >
          {readOnlyStatusLabel[status]}
        </span>
      )}
    </div>
  );
}
