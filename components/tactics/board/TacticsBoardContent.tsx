import type { TacticsPageData } from "@/hooks/tactics/useTacticsPageData";
import TacticsToolbar from "./TacticsToolbar";
import TacticsField from "./TacticsField";
import TacticsSidebar from "./TacticsSidebar";

interface TacticsBoardContentProps {
  data: TacticsPageData;
}

export default function TacticsBoardContent({
  data,
}: Readonly<TacticsBoardContentProps>) {
  const { canManage, tactics, presets, sortedAvailablePlayers, presetOptions } =
    data;

  return (
    <>
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
        savedPresets={presetOptions}
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
          playersLoaded={tactics.playersLoaded}
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
          canManage={canManage}
        />
      </div>
    </>
  );
}
