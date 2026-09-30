"use client";

import { useDemoData } from "@/components/demo/DemoModeProvider";
import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import {
  assignPlayerToTacticsSlot,
  changeTacticsFormation,
  clearTacticsSlot,
  createDefaultQuarterTactics,
  getAssignedPlayerIds,
  getPlayerById,
  resetTacticsFormation,
  sortPlayersByRecommendedPosition,
} from "@/lib/tactics/tactics-ui";
import type {
  FormationName,
  SavedFormation,
  SetPieceKey,
} from "@/types/tactics";
import { useState } from "react";

interface DemoPreset extends SavedFormation {
  id: string;
  name: string;
}

export default function DemoTacticsBoard() {
  const { players } = useDemoData();

  const [tactics, setTactics] = useState(() => createDefaultQuarterTactics());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<DemoPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");

  const selectedSlot = tactics.slots.find((slot) => slot.id === selectedSlotId);
  const assignedPlayerIds = getAssignedPlayerIds(tactics.slots);

  const availablePlayers = sortPlayersByRecommendedPosition(
    players.filter((player) => !assignedPlayerIds.has(player.id)),
    selectedSlot,
  );

  const handleReset = () => {
    setTactics((current) => resetTacticsFormation(current));
    setSelectedSlotId(null);
    setPresetName("");
    setSelectedPresetId("");
  };

  const handleChangeFormation = (formation: FormationName) => {
    setTactics((current) => changeTacticsFormation(current, formation));
    setSelectedSlotId(null);
  };

  const handleAssignPlayer = (playerId: string) => {
    if (!selectedSlotId) return;

    setTactics((current) =>
      assignPlayerToTacticsSlot(current, selectedSlotId, playerId),
    );
    setSelectedSlotId(null);
  };

  const handleClearSlot = () => {
    if (!selectedSlotId) return;

    setTactics((current) => clearTacticsSlot(current, selectedSlotId));
    setSelectedSlotId(null);
  };

  const handleChangeSetPiecePlayer = (key: SetPieceKey, value: string) => {
    setTactics((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleLoadPreset = (presetId: string) => {
    setSelectedPresetId(presetId);

    const preset = presets.find((item) => item.id === presetId);
    if (!preset) {
      setPresetName("");
      return;
    }

    setPresetName(preset.name);
    setTactics({
      formation: preset.formation,
      slots: preset.slots,
      cornerKickPlayerId: preset.cornerKickPlayerId,
      freeKickPlayerId: preset.freeKickPlayerId,
      penaltyKickPlayerId: preset.penaltyKickPlayerId,
    });
    setSelectedSlotId(null);
  };

  const handleSavePreset = () => {
    const name = presetName.trim();

    if (!name) {
      window.alert("전술 이름을 입력해 주세요.");
      return;
    }

    const preset = {
      name,
      formation: tactics.formation,
      slots: tactics.slots,
      cornerKickPlayerId: tactics.cornerKickPlayerId,
      freeKickPlayerId: tactics.freeKickPlayerId,
      penaltyKickPlayerId: tactics.penaltyKickPlayerId,
    };

    if (selectedPresetId) {
      setPresets((current) =>
        current.map((item) =>
          item.id === selectedPresetId ? { ...item, ...preset } : item,
        ),
      );
      return;
    }

    const id = crypto.randomUUID();

    setPresets((current) => [...current, { id, ...preset }]);
    setSelectedPresetId(id);
  };

  const handleDeletePreset = () => {
    if (!selectedPresetId) {
      window.alert("삭제할 전술을 먼저 선택해 주세요.");
      return;
    }

    setPresets((current) =>
      current.filter((preset) => preset.id !== selectedPresetId),
    );
    setSelectedPresetId("");
    setPresetName("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="전술 보드"
        description="포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
      />

      <TacticsToolbar
        formation={tactics.formation}
        onChangeFormation={handleChangeFormation}
        onReset={handleReset}
        saveMode="manual"
        presetName={presetName}
        onChangePresetName={setPresetName}
        savedPresets={presets}
        selectedPresetId={selectedPresetId}
        onLoadPreset={handleLoadPreset}
        onSave={handleSavePreset}
        onDelete={handleDeletePreset}
        canManage
        isSaving={false}
        isDeleting={false}
      />

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={tactics.formation}
          slots={tactics.slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          getPlayerById={(playerId) => getPlayerById(players, playerId)}
          canManage
        />

        <TacticsSidebar
          playersLoaded
          players={players}
          availablePlayers={availablePlayers}
          selectedSlot={selectedSlot}
          selectedSlotId={selectedSlotId}
          onAssignPlayer={handleAssignPlayer}
          onClearSlot={handleClearSlot}
          onCloseSlotPicker={() => setSelectedSlotId(null)}
          getPlayerById={(playerId) => getPlayerById(players, playerId)}
          cornerKickPlayerId={tactics.cornerKickPlayerId ?? ""}
          freeKickPlayerId={tactics.freeKickPlayerId ?? ""}
          penaltyKickPlayerId={tactics.penaltyKickPlayerId ?? ""}
          onChangeSetPiecePlayer={handleChangeSetPiecePlayer}
          canManage
        />
      </div>
    </div>
  );
}
