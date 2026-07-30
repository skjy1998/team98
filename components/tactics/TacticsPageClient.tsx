"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import { useTacticsBoard } from "@/hooks/tactics/useTacticsBoard";
import { useTacticsPresets } from "@/hooks/tactics/useTacticsPresets";
import { useCurrentTeamMember } from "@/hooks/team/useCurrentTeamMember";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics/tactics-ui";
import { useMemo } from "react";

export default function TacticsPageClient() {
  const { canManage, memberLoaded } = useCurrentTeamMember();
  const tactics = useTacticsBoard();
  const {
    playersLoaded,
    players,
    formation,
    slots,
    selectedSlotId,
    selectedSlot,
    availablePlayers,
    cornerKickPlayerId,
    freeKickPlayerId,
    penaltyKickPlayerId,
    getPlayerById,
    setSelectedSlotId,
    setCornerKickPlayerId,
    setFreeKickPlayerId,
    setPenaltyKickPlayerId,
    handleFormationChange,
    handleResetTactics,
    handleAssignPlayer,
    handleClearSlot,
    exportTactics,
    importTactics,
  } = tactics;

  const presets = useTacticsPresets({
    exportTactics,
    importTactics,
    resetTactics: handleResetTactics,
  });

  const {
    presetName,
    setPresetName,
    savedPresets,
    selectedPresetId,
    saveMessage,
    presetLoaded,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleResetPresetState,
  } = presets;

  const sortedAvailablePlayers = useMemo(
    () => sortPlayersByRecommendedPosition(availablePlayers, selectedSlot),
    [availablePlayers, selectedSlot],
  );

  const presetOptions = useMemo(
    () =>
      savedPresets.map((preset) => ({
        id: preset.id,
        name: preset.name,
      })),
    [savedPresets],
  );

  if (!memberLoaded || !playersLoaded || !presetLoaded) {
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
      {saveMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {saveMessage}
        </div>
      )}

      {!canManage && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          저장된 전술은 누구나 불러와서 볼 수 있고, 저장과 수정은 운영진만 할 수
          있어요.
        </div>
      )}
      <TacticsToolbar
        formation={formation}
        onChangeFormation={handleFormationChange}
        onReset={handleResetPresetState}
        saveMode="manual"
        presetName={presetName}
        onChangePresetName={setPresetName}
        savedPresets={presetOptions}
        selectedPresetId={selectedPresetId}
        onLoadPreset={handleLoadPreset}
        onSave={handleSavePreset}
        onDelete={handleDeletePreset}
        canManage={canManage}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TacticsField
          formation={formation}
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          getPlayerById={getPlayerById}
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
          getPlayerById={getPlayerById}
          cornerKickPlayerId={cornerKickPlayerId}
          freeKickPlayerId={freeKickPlayerId}
          penaltyKickPlayerId={penaltyKickPlayerId}
          onChangeCornerKickPlayerId={setCornerKickPlayerId}
          onChangeFreeKickPlayerId={setFreeKickPlayerId}
          onChangePenaltyKickPlayerId={setPenaltyKickPlayerId}
          canManage={canManage}
        />
      </div>
    </div>
  );
}
