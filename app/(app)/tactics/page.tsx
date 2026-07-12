"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";
import { useCurrentTeamMember } from "@/hooks/useCurrentTeamMember";
import { useTacticsBoard } from "@/hooks/useTacticsBoard";
import { useTacticsPresets } from "@/hooks/useTacticsPresets";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics-ui";

import { useMemo } from "react";

export default function TacticsPage() {
  const { canManage, memberLoaded } = useCurrentTeamMember();
  // 선수 목록 가져오는 훅
  const tactics = useTacticsBoard();

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

  if (!memberLoaded || !presets.presetLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">전술 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술 보드"
        description={
          canManage
            ? "포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
            : "팀 전술 배치를 확인할 수 있어요."
        }
      />
      {presets.saveMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {presets.saveMessage}
        </div>
      )}

      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          저장된 전술은 누구나 불러와서 볼 수 있고, 저장과 수정은 운영진만 할 수
          있어요.
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
        canManage={canManage}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={tactics.formation}
          slots={tactics.slots}
          selectedSlotId={tactics.selectedSlotId}
          onSelectSlot={tactics.setSelectedSlotId}
          getPlayerById={tactics.getPlayerById}
          canManage={canManage}
        />

        <TacticsSidebar
          loaded={tactics.playersLoaded}
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
          canManage={canManage}
        />
      </div>
    </div>
  );
}
