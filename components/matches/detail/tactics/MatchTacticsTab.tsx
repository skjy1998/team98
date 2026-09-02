import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";

import { useMatchTactics } from "@/hooks/matches/useMatchTactics";

import MatchQuarterTabs from "../MatchQuarterTabs";
import ContentState from "@/components/common/ContentState";
import type { TeamSport } from "@/types/team";
import type {
  MatchPlayersPerSide,
  MatchType,
  SelfMatchSide,
} from "@/types/match";

import MatchTacticsSideTabs from "./MatchTacticsSideTabs";
import type { PlayerType } from "@/types/player";
import type { MatchVote } from "@/types/match-vote";
import { useMatchTacticsEditor } from "@/hooks/matches/useMatchTacticsEditor";
import { FUTSAL_PLAYER_COUNT_OPTIONS } from "@/lib/tactics/tactics-ui";

interface MatchTacticsTabProps {
  matchId: string;
  matchType: MatchType;
  players: PlayerType[];
  votes: MatchVote[];
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  quarterCount: number;
  onChangePlayersPerSide: (
    playersPerSide: MatchPlayersPerSide,
  ) => Promise<boolean>;
  canManage: boolean;
}

export default function MatchTacticsTab({
  matchId,
  matchType,
  players,
  votes,
  sport,
  playersPerSide,
  quarterCount,
  onChangePlayersPerSide,
  canManage,
}: Readonly<MatchTacticsTabProps>) {
  const {
    tacticsBySide,
    saveTacticsBySide,
    tacticsLoaded,
    tacticsError,
    reloadMatchTactics,
  } = useMatchTactics(matchId, sport, playersPerSide, quarterCount);

  const {
    currentTactics,
    quarterOptions,
    formationOptions,
    selectedSlot,
    sortedAvailablePlayers,
    assignedPlayers,
    findPlayerById,
    selectedQuarter,
    selectedSide,
    selectedSlotId,
    isPlayerCountSaving,
    handleChangePlayersPerSide,
    handleFormationChange,
    handleResetFormation,
    handleAssignPlayer,
    handleClearSlot,
    handleChangeSetPiecePlayer,
    handleChangeQuarter,
    handleChangeSide,
    handleSelectSlot,
  } = useMatchTacticsEditor({
    matchType,
    sport,
    playersPerSide,
    quarterCount,
    players,
    votes,
    tacticsBySide,
    canManage,
    onChangePlayersPerSide,
    saveTacticsBySide,
  });

  const {
    formation,
    slots,
    cornerKickPlayerId = "",
    freeKickPlayerId = "",
    penaltyKickPlayerId = "",
  } = currentTactics;

  if (!tacticsLoaded) {
    return (
      <ContentState
        variant="loading"
        title="전술 정보를 불러오는 중..."
        description="경기 포메이션과 선수 배치를 준비하고 있어요."
      />
    );
  }

  if (tacticsError) {
    return (
      <ContentState
        variant="error"
        title="전술 정보를 불러오지 못했어요."
        description={tacticsError}
        action={
          <button
            type="button"
            onClick={() => void reloadMatchTactics()}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            다시 시도
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <MatchQuarterTabs
        quarters={quarterOptions}
        selectedQuarter={selectedQuarter}
        onChangeQuarter={handleChangeQuarter}
      />
      {matchType === "자체전" && (
        <MatchTacticsSideTabs
          selectedSide={selectedSide as SelfMatchSide}
          onChangeSide={handleChangeSide}
        />
      )}
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          전술 배치와 세트피스 설정은 운영진만 수정할 수 있어요.
        </div>
      )}
      <TacticsToolbar
        formation={formation}
        formationOptions={formationOptions}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
        canManage={canManage}
        playerCountState={
          sport === "futsal"
            ? {
                options: FUTSAL_PLAYER_COUNT_OPTIONS,
                value: playersPerSide,
                onChange: handleChangePlayersPerSide,
                isSaving: isPlayerCountSaving,
              }
            : undefined
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={handleSelectSlot}
          getPlayerById={findPlayerById}
          canManage={canManage}
        />

        <TacticsSidebar
          playersLoaded
          players={assignedPlayers}
          availablePlayers={sortedAvailablePlayers}
          showKickerSection={sport === "soccer"}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
          getPlayerById={findPlayerById}
          cornerKickPlayerId={cornerKickPlayerId}
          freeKickPlayerId={freeKickPlayerId}
          penaltyKickPlayerId={penaltyKickPlayerId}
          onChangeCornerKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("cornerKickPlayerId", value)
          }
          onChangeFreeKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("freeKickPlayerId", value)
          }
          onChangePenaltyKickPlayerId={(value) =>
            handleChangeSetPiecePlayer("penaltyKickPlayerId", value)
          }
          playerListEmptyMessage={
            matchType === "자체전"
              ? "출석 탭에서 현재 팀에 선수를 먼저 배정하세요."
              : "출석 탭에서 참석 선수를 먼저 체크하세요."
          }
          canManage={canManage}
        />
      </div>
    </div>
  );
}
