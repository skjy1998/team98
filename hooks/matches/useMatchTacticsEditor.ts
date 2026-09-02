import { useToastStore } from "@/stores/toast-store";
import type {
  MatchPlayersPerSide,
  MatchType,
  SelfMatchSide,
} from "@/types/match";
import type { MatchVote } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";
import type {
  FormationName,
  MatchQuarter,
  QuarterTacticsState,
  SetPieceKey,
  MatchTacticsByQuarter,
  MatchTacticsBySide,
  MatchTacticsSide,
} from "@/types/tactics";
import type { TeamSport } from "@/types/team";
import { useState } from "react";
import { useMatchTacticsViewData } from "./useMatchTacticsViewData";
import { useMatchPlayerCountAction } from "./useMatchPlayerCountAction";
import {
  assignPlayerToTacticsSlot,
  changeTacticsFormation,
  clearTacticsSlot,
  resetTacticsFormation,
} from "@/lib/tactics/tactics-ui";

interface UseMatchTacticsEditorParams {
  matchType: MatchType;
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  quarterCount: number;
  players: PlayerType[];
  votes: MatchVote[];
  tacticsBySide: MatchTacticsBySide;
  canManage: boolean;
  onChangePlayersPerSide: (
    playersPerSide: MatchPlayersPerSide,
  ) => Promise<boolean>;
  saveTacticsBySide: (
    side: MatchTacticsSide,
    updater:
      | MatchTacticsByQuarter
      | ((current: MatchTacticsByQuarter) => MatchTacticsByQuarter),
  ) => Promise<boolean>;
}

export function useMatchTacticsEditor({
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
}: UseMatchTacticsEditorParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");
  const [selectedSide, setSelectedSide] = useState<MatchTacticsSide>(
    matchType === "자체전" ? "team_a" : "our",
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const viewData = useMatchTacticsViewData({
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

  const { assignedPlayerIds } = viewData;
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

  const updateCurrentQuarterTactics = (
    updater: (current: QuarterTacticsState) => QuarterTacticsState,
  ) => {
    void saveTacticsBySide(selectedSide, (current) => ({
      ...current,
      [selectedQuarter]: updater(current[selectedQuarter]),
    }));
  };

  const handleFormationChange = (formation: FormationName) => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) =>
      changeTacticsFormation(current, formation),
    );

    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    if (!canManage) return;

    updateCurrentQuarterTactics(resetTacticsFormation);

    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!canManage || !selectedSlotId) return;

    if (assignedPlayerIds.has(playerId)) {
      showToast("이미 해당 쿼터의 다른 위치나 팀에 배치된 선수에요.", "error");
      return;
    }

    updateCurrentQuarterTactics((current) =>
      assignPlayerToTacticsSlot(current, selectedSlotId, playerId),
    );

    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!canManage || !selectedSlotId) return;

    updateCurrentQuarterTactics((current) =>
      clearTacticsSlot(current, selectedSlotId),
    );

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

  return {
    ...viewData,
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
  };
}
