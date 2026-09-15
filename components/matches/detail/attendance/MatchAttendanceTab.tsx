import type {
  MatchAttendance,
  MatchAttendanceStatus,
} from "@/types/match-attendance";
import type { PlayerType } from "@/types/player";
import FinanceReadonlyNotice from "@/components/finance/FinanceReadonlyNotice";
import type { MatchVote } from "@/types/match-vote";
import type { MatchType, SelfMatchSide } from "@/types/match";
import SelfMatchTeamAssignmentSection from "./SelfMatchTeamAssignmentSection";
import MatchAttendanceCheckSection from "./MatchAttendanceCheckSection";
import MatchAttendanceModeTabs, {
  type MatchAttendanceMode,
} from "./MatchAttendanceModeTabs";
import { useState } from "react";
import { useMatchAttendanceTabActions } from "@/hooks/matches/useMatchAttendanceTabActions";

interface MatchAttendanceTabProps {
  matchId: string;
  matchType: MatchType;
  votes: MatchVote[];
  players: PlayerType[];
  attendance: MatchAttendance[];
  canManage: boolean;
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

export default function MatchAttendanceTab({
  matchId,
  matchType,
  votes,
  players,
  attendance,
  canManage,
  saveVoteSide,
  saveAttendance,
  deleteAttendance,
}: Readonly<MatchAttendanceTabProps>) {
  const { handleChangeSide, handleChangeStatus, handleMarkAllAttend } =
    useMatchAttendanceTabActions({
      matchId,
      players,
      attendance,
      saveVoteSide,
      saveAttendance,
      deleteAttendance,
    });

  const [activeMode, setActiveMode] =
    useState<MatchAttendanceMode>("assignment");

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
