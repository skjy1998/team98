"use client";

import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";
import { formationTemplate } from "@/data/formationTemplates";
import { useMatchTactics } from "@/hooks/matches/useMatchTactics";
import { useMatchVotes } from "@/hooks/matches/useMatchVotes";
import { usePlayers } from "@/hooks/players/usePlayers";
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
import MatchQuarterTabs from "../MatchQuarterTabs";

interface MatchTacticsTabProps {
  matchId: string;
  canManage: boolean;
}

export default function MatchTacticsTab({
  matchId,
  canManage,
}: Readonly<MatchTacticsTabProps>) {
  const { players, playersLoaded } = usePlayers();
  const { votes } = useMatchVotes();
  const { tacticsByQuarter, saveTacticsByQuarter, tacticsLoaded } =
    useMatchTactics(matchId);

  const [selectedQuarter, setSelectedQuarter] = useState<MatchQuarter>("1Q");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const currentTactics = tacticsByQuarter[selectedQuarter];

  const {
    formation,
    slots,
    cornerKickPlayerId = "",
    freeKickPlayerId = "",
    penaltyKickPlayerId = "",
  } = currentTactics;

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
    saveTacticsByQuarter((prev) => ({
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
    }));
    setSelectedSlotId(null);
  };

  const handleResetFormation = () => {
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      slots: formationTemplate[current.formation],
    }));
    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!canManage) return;
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
    if (!canManage) return;
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
    if (!canManage) return;

    updateCurrentQuarterTactics((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const findPlayerById = (playerId?: string) =>
    getPlayerById(players, playerId);

  const handleChangeQuarter = (quarter: MatchQuarter) => {
    setSelectedQuarter(quarter);
    setSelectedSlotId(null);
  };

  const handleSelectSlot = (slotId: string | null) => {
    if (!canManage) return;
    setSelectedSlotId(slotId);
  };

  if (!playersLoaded || !tacticsLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">전술 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MatchQuarterTabs
        quarters={quarterOptions}
        selectedQuarter={selectedQuarter}
        onChangeQuarter={handleChangeQuarter}
      />
      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          전술 배치와 세트피스 설정은 운영진만 수정할 수 있어요.
        </div>
      )}
      <TacticsToolbar
        formation={formation}
        onChangeFormation={handleFormationChange}
        onReset={handleResetFormation}
        saveMode="auto"
        canManage={canManage}
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
          playersLoaded={playersLoaded}
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
          playerListEmptyMessage="출석 탭에서 참석 선수를 먼저 체크하세요."
          canManage={canManage}
        />
      </div>
    </div>
  );
}
