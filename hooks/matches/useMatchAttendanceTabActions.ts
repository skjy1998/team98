import { useToastStore } from "@/stores/toast-store";
import type { SelfMatchSide } from "@/types/match";
import type {
  MatchAttendance,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";

interface UseMatchAttendanceTabActionsParams {
  matchId: string;
  players: PlayerType[];
  attendance: MatchAttendance[];
  saveVoteSide: (
    matchId: string,
    playerId: string,
    side: SelfMatchSide | null,
  ) => Promise<boolean>;
  saveAttendance: (
    matchId: string,
    playerId: string,
    status: MatchAttendanceStatus,
  ) => Promise<boolean>;
  deleteAttendance: (matchId: string, playerId: string) => Promise<boolean>;
}

export function useMatchAttendanceTabActions({
  matchId,
  players,
  attendance,
  saveVoteSide,
  saveAttendance,
  deleteAttendance,
}: UseMatchAttendanceTabActionsParams) {
  const showToast = useToastStore((state) => state.showToast);

  const handleChangeStatus = async (
    playerId: string,
    status: MatchAttendanceStatus | "unchecked",
  ) => {
    const success =
      status === "unchecked"
        ? await deleteAttendance(matchId, playerId)
        : await saveAttendance(matchId, playerId, status);

    if (!success) {
      showToast("출석 저장에 실패했어요.", "error");
    }
  };

  const handleChangeSide = async (
    playerId: string,
    side: SelfMatchSide | null,
  ) => {
    const success = await saveVoteSide(matchId, playerId, side);

    if (!success) {
      showToast("팀 배정 저장에 실패했어요.", "error");
    }
  };

  const handleMarkAllAttend = async () => {
    const attendedPlayerIds = new Set(
      attendance
        .filter((item) => item.status === "attend")
        .map((item) => item.playerId),
    );

    const targets = players.filter(
      (player) => !attendedPlayerIds.has(player.id),
    );

    for (const player of targets) {
      const success = await saveAttendance(matchId, player.id, "attend");

      if (!success) {
        showToast("전체 출석 처리 중 저장에 실패했어요.", "error");
        return;
      }
    }

    showToast("투표 참석 인원을 모두 출석 처리했어요.", "success");
  };

  return {
    handleChangeStatus,
    handleChangeSide,
    handleMarkAllAttend,
  };
}
