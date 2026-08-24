import type {
  MatchAttendance,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";
import FinanceReadonlyNotice from "@/components/finance/FinanceReadonlyNotice";
import { useToastStore } from "@/stores/toast-store";
import type { MatchVote } from "@/types/match-vote";
import type { MatchType, SelfMatchSide } from "@/types/match";
import SelfMatchTeamAssignmentSection from "./SelfMatchTeamAssignmentSection";
import MatchAttendanceCheckSection from "./MatchAttendanceCheckSection";
import MatchAttendanceModeTabs, {
  MatchAttendanceMode,
} from "./MatchAttendanceModeTabs";
import { useState } from "react";

interface MatchAttendanceTabProps {
  matchId: string;
  matchType: MatchType;
  votes: MatchVote[];
  saveVoteSide: (
    matchId: string,
    playerId: string,
    side: SelfMatchSide | null,
  ) => Promise<boolean>;
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
  matchType,
  votes,
  saveVoteSide,
  players,
  attendance,
  canManage,
  saveAttendance,
  deleteAttendance,
}: Readonly<MatchAttendanceTabProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const [activeMode, setActiveMode] =
    useState<MatchAttendanceMode>("assignment");

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
    if (players.length === 0) return;

    for (const player of players) {
      const currentAttendance = attendance.find(
        (item) => item.playerId === player.id,
      );

      if (currentAttendance?.status === "attend") continue;

      const success = await saveAttendance(matchId, player.id, "attend");

      if (!success) {
        showToast("전체 출석 처리 중 저장에 실패했어요.", "error");
        return;
      }
    }

    showToast("투표 참석 인원을 모두 출석 처리했어요.", "success");
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

      {matchType === "자체전" && (
        <MatchAttendanceModeTabs
          activeMode={activeMode}
          onChangeMode={setActiveMode}
        />
      )}

      {matchType === "자체전" && activeMode === "assignment" ? (
        <SelfMatchTeamAssignmentSection
          players={players}
          votes={votes}
          canManage={canManage}
          onChangeSide={(playerId, side) =>
            void handleChangeSide(playerId, side)
          }
        />
      ) : (
        <MatchAttendanceCheckSection
          players={players}
          attendance={attendance}
          canManage={canManage}
          onChangeStatus={(playerId, status) =>
            void handleChangeStatus(playerId, status)
          }
          onMarkAllAttend={() => void handleMarkAllAttend()}
        />
      )}
    </div>
  );
}
