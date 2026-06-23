"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";

import { useTacticsBoard } from "@/hooks/useTacticsBoard";
import { useTacticsPresets } from "@/hooks/useTacticsPresets";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics-ui";

import { useMemo } from "react";

export default function TacticsPage() {
  // 선수 목록 가져오는 훅
  const tactics = useTacticsBoard({
    storageKey: "tacticsFormation",
    autoSave: false,
  });

  const presets = useTacticsPresets({
    exportTactics: tactics.exportTactics,
    importTactics: tactics.importTactics,
    resetTactics: tactics.handleResetFormation,
  });

  const sortedAvailablePlayers = useMemo(
    () =>
      sortPlayersByRecommendedPosition(
        tactics.availablePlayers,
        tactics.selectedSlot,
      ),
    [tactics.availablePlayers, tactics.selectedSlot],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술 보드"
        description="포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
      />
      {presets.saveMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {presets.saveMessage}
        </div>
      )}
      <TacticsToolbar
        formation={tactics.formation}
        onChangeFormation={tactics.handleFormationChange}
        onReset={presets.handleResetPresetState}
        saveMode="manual"
        presetName={presets.presetName}
        onChangePresetName={presets.setPresetName}
        savedPresets={presets.savedPresets.map((preset) => ({
          id: preset.id,
          name: preset.name,
        }))}
        selectedPresetId={presets.selectedPresetId}
        onLoadPreset={presets.handleLoadPreset}
        onSave={presets.handleSavePreset}
        onDelete={presets.handleDeletePreset}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={tactics.formation}
          slots={tactics.slots}
          selectedSlotId={tactics.selectedSlotId}
          onSelectSlot={tactics.setSelectedSlotId}
          getPlayerById={tactics.getPlayerById}
        />

        <TacticsSidebar
          loaded={tactics.loaded}
          players={tactics.players}
          availablePlayers={sortedAvailablePlayers}
          selectedSlot={tactics.selectedSlot}
          selectedSlotId={tactics.selectedSlotId}
          onAssignPlayer={tactics.handleAssignPlayer}
          onClearSlot={tactics.handleClearSlot}
          getPlayerById={tactics.getPlayerById}
          cornerKickPlayerId={tactics.cornerKickPlayerId}
          freeKickPlayerId={tactics.freeKickPlayerId}
          penaltyKickPlayerId={tactics.penaltyKickPlayerId}
          onChangeCornerKickPlayerId={tactics.setCornerKickPlayerId}
          onChangeFreeKickPlayerId={tactics.setFreeKickPlayerId}
          onChangePenaltyKickPlayerId={tactics.setPenaltyKickPlayerId}
          cornerKickPlayer={tactics.cornerKickPlayer}
          freeKickPlayer={tactics.freeKickPlayer}
          penaltyKickPlayer={tactics.penaltyKickPlayer}
        />
      </div>
    </div>
  );
}
