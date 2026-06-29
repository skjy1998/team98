"use client";

import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { useMatchTactics } from "@/hooks/useMatchTactics";
import { useMatchVotes } from "@/hooks/useMatchVotes";
import { usePlayers } from "@/hooks/usePlayers";
import {
  getAssignedPlayerIds,
  getAttendPlayerIds,
  getAvailableTacticsPlayers,
  getPlayerById,
  quarterOptions,
  sortPlayersByRecommendedPosition,
} from "@/lib/tactics-ui";
import type { FormationName, MatchQuarter, SetPieceKey } from "@/types/tactics";
import { useMemo, useState } from "react";
import MatchQuarterTabs from "./MatchQuarterTabs";

interface MatchTacticsTabProps {
  matchId: string;
}

export default function MatchTacticsTab({
  matchId,
}: Readonly<MatchTacticsTabProps>) {
  const { players, playersLoaded } = usePlayers();
  const { votes } = useMatchVotes();
  const { tacticsByQuarter, setTacticsByQuarter } = useMatchTactics(matchId);

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const currentTactics = tacticsByQuarter[selectedQuarter];

  const formation = currentTactics.formation;
  const slots = currentTactics.slots;
  const cornerKickPlayerId = currentTactics.cornerKickPlayerId ?? "";
  const freeKickPlayerId = currentTactics.freeKickPlayerId ?? "";
  const penaltyKickPlayerId = currentTactics.penaltyKickPlayerId ?? "";

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );
  const currentVotes = useMemo(() => votes[matchId] ?? [], [votes, matchId]);

  // 현재 경기 참석자 id 구하기
  const attendPlayerIds = useMemo(
    () => getAttendPlayerIds(currentVotes),
    [currentVotes],
  );

  const assignedPlayerIds = useMemo(() => getAssignedPlayerIds(slots), [slots]);

  const availablePlayers = useMemo(
    () =>
      getAvailableTacticsPlayers(players, attendPlayerIds, assignedPlayerIds),
    [players, attendPlayerIds, assignedPlayerIds],
  );

  const sortedAvailablePlayers = useMemo(
    () => sortPlayersByRecommendedPosition(availablePlayers, selectedSlot),
    [availablePlayers, selectedSlot],
  );

  const updateCurrentQuarterTactics = (
    updater: (
      current: (typeof tacticsByQuarter)[MatchQuarter],
    ) => (typeof tacticsByQuarter)[MatchQuarter],
  ) => {
    setTacticsByQuarter((prev) => ({
      ...prev,
      [selectedQuarter]: updater(prev[selectedQuarter]),
    }));
  };

  const handleFormationChange = (value: FormationName) => {
    updateCurrentQuarterTactics((current) => ({
      ...current,
      formation: value,
      slots: formationTemplate[value],
    }));
    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: formationTemplate[current.formation],
    }));
    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId } : slot,
      ),
    }));

    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === selectedSlotId ? { ...slot, playerId: undefined } : slot,
      ),
    }));

    setSelectedSlotId(null);
  };

  const handleChangeSetPiecePlayer = (key: SetPieceKey, value: string) => {
    updateCurrentQuarterTactics((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const findPlayerById = (playerId?: string) => {
    return getPlayerById(players, playerId);
  };

  const handleChangeQuarter = (quarter: MatchQuarter) => {
    setSelectedQuarter(quarter);
    setSelectedSlotId(null);
  };

  const cornerKickPlayer = findPlayerById(cornerKickPlayerId);
  const freeKickPlayer = findPlayerById(freeKickPlayerId);
  const penaltyKickPlayer = findPlayerById(penaltyKickPlayerId);

  return (
    <div className="space-y-6">
      <MatchQuarterTabs
        quarters={quarterOptions}
        selectedQuarter={selectedQuarter}
        onChangeQuarter={handleChangeQuarter}
      />
      <TacticsToolbar
        formation={formation}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          getPlayerById={findPlayerById}
        />

        <TacticsSidebar
          loaded={playersLoaded}
          players={players}
          availablePlayers={sortedAvailablePlayers}
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
          cornerKickPlayer={cornerKickPlayer}
          freeKickPlayer={freeKickPlayer}
          penaltyKickPlayer={penaltyKickPlayer}
          playerListemptyMessage="출석 탭에서 참석 선수를 먼저 체크하세요."
        />
      </div>
    </div>
  );
}
