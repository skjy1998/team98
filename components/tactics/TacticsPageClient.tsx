"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/board/TacticsField";
import TacticsSidebar from "@/components/tactics/board/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/board/TacticsToolbar";
import ContentState from "../common/ContentState";
import { useTacticsPageData } from "@/hooks/tactics/useTacticsPageData";

export default function TacticsPageClient() {
  const {
    canManage,
    isLoaded,
    pageError,
    reloadPageData,
    tactics,
    presets,
    sortedAvailablePlayers,
    presetOptions,
  } = useTacticsPageData();

  const {
    playersLoaded,
    players,
    formation,
    slots,
    selectedSlotId,
    selectedSlot,
    cornerKickPlayerId,
    freeKickPlayerId,
    penaltyKickPlayerId,
    getPlayerById,
    setSelectedSlotId,
    setCornerKickPlayerId,
    setFreeKickPlayerId,
    setPenaltyKickPlayerId,
    handleFormationChange,
    handleAssignPlayer,
    handleClearSlot,
  } = tactics;

  const {
    presetName,
    setPresetName,
    selectedPresetId,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleResetPresetState,
  } = presets;

  if (!isLoaded) {
    return (
      <ContentState
        variant="loading"
        title="전술 정보를 불러오는 중..."
        description="포메이션과 선수 배치를 준비하고 있어요."
      />
    );
  }

  if (pageError) {
    return (
      <ContentState
        variant="error"
        title="전술 정보를 불러오지 못했어요."
        description={pageError}
        action={
          <button
            type="button"
            onClick={() => void reloadPageData()}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            다시 시도
          </button>
        }
      />
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
