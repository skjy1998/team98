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
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">출석 체크</h2>
          <p className="mt-1 text-sm text-stone-500">
            투표에서 참석을 선택한 선수만 표시돼요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <button
              type="button"
              onClick={onMarkAllAttend}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              전원 출석 처리
            </button>
          )}

          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">
            총 {players.length}명
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {players.map((player) => {
          const currentAttendance = attendance.find(
            (item) => item.playerId === player.id,
          );

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
