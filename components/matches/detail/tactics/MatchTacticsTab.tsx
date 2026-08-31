import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { useMatchTactics } from "@/hooks/matches/useMatchTactics";
import type {
  FormationName,
  MatchQuarter,
  MatchTacticsSide,
  SetPieceKey,
} from "@/types/tactics";
import { useState } from "react";
import MatchQuarterTabs from "../MatchQuarterTabs";
import ContentState from "@/components/common/ContentState";
import type { TeamSport } from "@/types/team";
import type {
  MatchPlayersPerSide,
  MatchType,
  SelfMatchSide,
} from "@/types/match";
import { useToastStore } from "@/stores/toast-store";
import MatchTacticsSideTabs from "./MatchTacticsSideTabs";
import type { PlayerType } from "@/types/player";
import type { MatchVote } from "@/types/match-vote";
import { useMatchTacticsViewData } from "@/hooks/matches/useMatchTacticsViewData";
import { useMatchPlayerCountAction } from "@/hooks/matches/useMatchPlayerCountAction";

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

const futsalPlayerCountOptions: readonly MatchPlayersPerSide[] = [
  3, 4, 5, 6, 7,
];

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
  const showToast = useToastStore((state) => state.showToast);

  const {
    tacticsBySide,
    saveTacticsBySide,
    tacticsLoaded,
    tacticsError,
    reloadMatchTactics,
  } = useMatchTactics(matchId, sport, playersPerSide, quarterCount);

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");
  const [selectedSide, setSelectedSide] = useState<MatchTacticsSide>(
    matchType === "자체전" ? "team_a" : "our",
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const { isPlayerCountSaving, handleChangePlayersPerSide } =
    useMatchPlayerCountAction({
      matchType,
      sport,
      playersPerSide,
      quarterCount,
      canManage,
      onChangePlayersPerSide,
      saveTacticsBySide,
      onResetSelection: () => setSelectedSlotId(null),
    });

  const {
    tacticsByQuarter,
    currentTactics,
    quarterOptions,
    formationOptions,
    selectedSlot,
    assignedPlayerIds,
    sortedAvailablePlayers,
    assignedPlayers,
    findPlayerById,
  } = useMatchTacticsViewData({
    matchType,
    sport,
    playersPerSide,
    quarterCount,
    players,
    votes,
    tacticsBySide,
    selectedQuarter,
    selectedSide,
    selectedSlotId,
  });

  const {
    formation,
    slots,
    cornerKickPlayerId = "",
    freeKickPlayerId = "",
    penaltyKickPlayerId = "",
  } = currentTactics;

  const updateCurrentQuarterTactics = (
    updater: (
      current: (typeof tacticsByQuarter)[MatchQuarter],
    ) => (typeof tacticsByQuarter)[MatchQuarter],
  ) => {
    void saveTacticsBySide(selectedSide, (prev) => ({
      ...prev,
      [selectedQuarter]: updater(prev[selectedQuarter]),
    }));
  };

  const handleFormationChange = (value: FormationName) => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      formation: value,
      slots: formationTemplate[value],
      cornerKickPlayerId: "",
      freeKickPlayerId: "",
      penaltyKickPlayerId: "",
    }));

    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: formationTemplate[current.formation],
      cornerKickPlayerId: "",
      freeKickPlayerId: "",
      penaltyKickPlayerId: "",
    }));

    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!canManage || !selectedSlotId) return;

    if (assignedPlayerIds.has(playerId)) {
      showToast("이미 해당 쿼터의 다른 위치나 팀에 배치된 선수에요.", "error");
      return;
    }

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId } : slot,
      ),
    }));

    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!canManage || !selectedSlotId) return;

    updateCurrentQuarterTactics((current) => {
      const clearedPlayersId = current.slots.find(
        (slot) => slot.id === selectedSlotId,
      )?.playerId;

      return {
        ...current,
        slots: current.slots.map((slot) =>
          slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
        ),
        cornerKickPlayerId:
          current.cornerKickPlayerId === clearedPlayersId
            ? ""
            : current.cornerKickPlayerId,
        freeKickPlayerId:
          current.freeKickPlayerId === clearedPlayersId
            ? ""
            : current.freeKickPlayerId,
        penaltyKickPlayerId:
          current.penaltyKickPlayerId === clearedPlayersId
            ? ""
            : current.penaltyKickPlayerId,
      };
    });

    setSelectedSlotId(null);
  };

  const handleChangeSetPiecePlayer = (key: SetPieceKey, value: string) => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleChangeQuarter = (quarter: MatchQuarter) => {
    setSelectedQuarter(quarter);
    setSelectedSlotId(null);
  };

  const handleChangeSide = (side: SelfMatchSide) => {
    setSelectedSide(side);
    setSelectedSlotId(null);
  };

  const handleSelectSlot = (slotId: string | null) => {
    if (!canManage) return;
    setSelectedSlotId(slotId);
  };

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
                options: futsalPlayerCountOptions,
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
