import type {
  MatchAttendance,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";
import FinanceReadonlyNotice from "@/components/finance/FinanceReadonlyNotice";
import AttendanceMemberRow from "./AttendanceMemberRow";

interface MatchAttendanceTabProps {
  matchId: string;
  players: PlayerType[];
  attendance: MatchAttendance[];
  canManage: boolean;
  saveAttendance: (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => Promise<boolean>;
  deleteAttendance: (matchId: string, playerId: string) => Promise<boolean>;
}

export default function MatchAttendanceTab({
  matchId,
  players,
  attendance,
  canManage,
  saveAttendance,
  deleteAttendance,
}: Readonly<MatchAttendanceTabProps>) {
  const handleChangeStatus = async (
    playerId: string,
    status: MatchAttendanceStatus | "unchecked",
  ) => {
    const success =
      status === "unchecked"
        ? await deleteAttendance(matchId, playerId)
        : await saveAttendance(matchId, playerId, status);

    if (!success) {
      globalThis.alert("출석 저장에 실패했어요.");
    }
  };

  const handleMarkAllAttend = async () => {
    if (players.length === 0) return;

    for (const player of players) {
      const currentAttendance = attendance.find(
        (item) => item.playerId === player.id,
      );

      if (currentAttendance?.status === "attend") continue;

      const success = await saveAttendance(matchId, player.id, "attend");

      if (!success) {
        globalThis.alert("전체 출석 처리 중 저장에 실패했어요.");
        return;
      }
    }

    globalThis.alert("투표 참석 인원을 모두 출석 처리했어요.");
  };

  if (players.length === 0) {
    return (
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">출석 체크</h2>
        <p className="mt-3 text-sm text-stone-500">
          투표에서 참석을 선택한 선수가 아직 없어요.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {!canManage && (
        <FinanceReadonlyNotice message="출석 현황은 조회할 수 있고, 변경은 운영진만 할 수 있어요." />
      )}

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
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
                onClick={handleMarkAllAttend}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                전원 출석 처리
              </button>
            )}
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
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
                onChangeStatus={handleChangeStatus}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
