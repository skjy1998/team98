import MatchQuarterTabs from "@/components/matches/detail/MatchQuarterTabs";
import MatchTacticsSideTabs from "@/components/matches/detail/tactics/MatchTacticsSideTabs";
import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import { useDemoData } from "@/components/demo/DemoModeProvider";
import { useMatchTacticsEditor } from "@/hooks/matches/useMatchTacticsEditor";
import {
  createDefaultMatchTacticsBySide,
  FUTSAL_PLAYER_COUNT_OPTIONS,
} from "@/lib/tactics/tactics-ui";
import type {
  MatchPlayersPerSide,
  MatchType,
  SelfMatchSide,
} from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import type { TeamSport } from "@/types/team";

interface DemoMatchTacticsTabProps {
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
}

export default function DemoMatchTacticsTab({
  matchId,
  matchType,
  players,
  votes,
  sport,
  playersPerSide,
  quarterCount,
  onChangePlayersPerSide,
}: Readonly<DemoMatchTacticsTabProps>) {
  const { matchTactics, saveMatchTactics } = useDemoData();

  const tacticsBySide =
    matchTactics[matchId] ??
    createDefaultMatchTacticsBySide(sport, playersPerSide, quarterCount);

  const saveTacticsBySide = (
    side: "our" | SelfMatchSide,
    updater: Parameters<typeof saveMatchTactics>[5],
  ) =>
    saveMatchTactics(
      matchId,
      sport,
      playersPerSide,
      quarterCount,
      side,
      updater,
    );

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
    canManage: true,
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

  const selectedSelfMatchSide: SelfMatchSide =
    selectedSide === "team_b" ? "team_b" : "team_a";

  const playerCountState =
    sport === "futsal"
      ? {
          options: FUTSAL_PLAYER_COUNT_OPTIONS,
          value: playersPerSide,
          onChange: handleChangePlayersPerSide,
          isSaving: isPlayerCountSaving,
        }
      : undefined;

  const playerListEmptyMessage =
    matchType === "자체전"
      ? "출석 탭에서 현재 팀에 선수를 먼저 배정하세요."
      : "출석 탭에서 참석 선수를 먼저 체크하세요.";

  return (
    <div className="space-y-6">
      <MatchQuarterTabs
        quarters={quarterOptions}
        selectedQuarter={selectedQuarter}
        onChangeQuarter={handleChangeQuarter}
      />

      {matchType === "자체전" && (
        <MatchTacticsSideTabs
          selectedSide={selectedSelfMatchSide}
          onChangeSide={handleChangeSide}
        />
      )}

      <TacticsToolbar
        formation={formation}
        formationOptions={formationOptions}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
        canManage
        playerCountState={playerCountState}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={handleSelectSlot}
          getPlayerById={findPlayerById}
          canManage
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
          onChangeSetPiecePlayer={handleChangeSetPiecePlayer}
          playerListEmptyMessage={playerListEmptyMessage}
          onCloseSlotPicker={() => handleSelectSlot(null)}
          canManage
        />
      </div>
    </div>
  );
}
