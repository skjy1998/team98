import type {
  MatchAttendance,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";
import AttendanceMemberRow from "./AttendanceMemberRow";

interface MatchAttendanceCheckSectionProps {
  players: PlayerType[];
  attendance: MatchAttendance[];
  canManage: boolean;
  onChangeStatus: (
    playerId: string,
    status: MatchAttendanceStatus | "unchecked",
  ) => void;
  onMarkAllAttend: () => void;
}

export default function MatchAttendanceCheckSection({
  players,
  attendance,
  canManage,
  onChangeStatus,
  onMarkAllAttend,
}: Readonly<MatchAttendanceCheckSectionProps>) {
  const attendanceByPlayerId = new Map(
    attendance.map((item) => [item.playerId, item]),
  );

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
      <div className="flex items-start justify-between gap-2 sm:items-center sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
            출석 체크
          </h2>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            <span className="sm:hidden">참석자만 표시돼요.</span>
            <span className="hidden sm:inline">
              투표에서 참석을 선택한 선수만 표시돼요.
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {canManage && (
            <button
              type="button"
              onClick={onMarkAllAttend}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:rounded-xl sm:text-sm"
            >
              전원 출석 처리
            </button>
          )}

          <span className="rounded-full bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-600 sm:px-3 sm:text-sm">
            총 {players.length}명
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
        {players.map((player) => {
          const currentAttendance = attendanceByPlayerId.get(player.id);

          return (
            <AttendanceMemberRow
              key={player.id}
              id={player.id}
              name={player.name}
              status={currentAttendance?.status ?? "unchecked"}
              canEdit={canManage}
              onChangeStatus={onChangeStatus}
            />
          );
        })}
      </div>
    </section>
  );
}
