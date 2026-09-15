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

type AttendanceUiStatus = MatchAttendanceStatus | "unchecked";

const selectableStatuses = ["attend", "late", "absent"] as const;

const statusMeta = {
  attend: {
    label: "출석",
    activeClassName: "bg-emerald-600 text-white",
    readOnlyClassName: "bg-emerald-100 text-emerald-700",
  },
  late: {
    label: "지각",
    activeClassName: "bg-amber-500 text-white",
    readOnlyClassName: "bg-amber-100 text-amber-700",
  },
  absent: {
    label: "무단불참",
    activeClassName: "bg-rose-600 text-white",
    readOnlyClassName: "bg-rose-100 text-rose-700",
  },
  unchecked: {
    label: "미체크",
    activeClassName: "",
    readOnlyClassName: "bg-stone-100 text-stone-600",
  },
} satisfies Record<
  AttendanceUiStatus,
  {
    label: string;
    activeClassName: string;
    readOnlyClassName: string;
  }
>;

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
          {selectableStatuses.map((optionStatus) => {
            const option = statusMeta[optionStatus];
            const isActive = status === optionStatus;

            return (
              <button
                key={optionStatus}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  onChangeStatus(id, isActive ? "unchecked" : optionStatus)
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
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMeta[status].readOnlyClassName}`}
        >
          {statusMeta[status].label}
        </span>
      )}
    </div>
  );
}
