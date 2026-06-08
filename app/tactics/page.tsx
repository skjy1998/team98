"use client";

import PageHeader from "@/components/PageHeader";
import TacticsField from "@/components/tactics/TacticsField";
import TacticsSidebar from "@/components/tactics/TacticsSidebar";
import TacticsToolbar from "@/components/tactics/TacticsToolbar";

import { useTacticsBoard } from "@/hooks/useTacticsBoard";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics-ui";
import { SaveTacticPreset } from "@/types/tactics";

import { useEffect, useMemo, useState } from "react";

export default function TacticsPage() {
  // 선수 목록 가져오는 훅
  const tactics = useTacticsBoard({
    storageKey: "tacticsFormation",
    autoSave: false,
  });

  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<SaveTacticPreset[]>([]);
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const sortedAvailablePlayers = useMemo(
    () =>
      sortPlayersByRecommendedPosition(
        tactics.availablePlayers,
        tactics.selectedSlot,
      ),
    [tactics.availablePlayers, tactics.selectedSlot],
  );

  useEffect(() => {
    const saved = localStorage.getItem("tactics-presets");

    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedPresets(JSON.parse(saved));
    }

    setPresetLoaded(true);
  }, []);

  useEffect(() => {
    if (!presetLoaded) return;
    localStorage.setItem("tactics-presets", JSON.stringify(savedPresets));
  }, [savedPresets, presetLoaded]);

  useEffect(() => {
    if (!saveMessage) return;

    const timer = setTimeout(() => {
      setSaveMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [saveMessage]);

  // 저장하기 함수
  const handleSavePreset = () => {
    if (!presetName.trim()) {
      alert("전술 이름을 입력해주세요.");
      return;
    }

    const exported = tactics.exportTactics();

    if (selectedPresetId) {
      setSavedPresets((prev) =>
        prev.map((preset) =>
          preset.id === selectedPresetId
            ? {
                ...preset,
                name: presetName.trim(),
                formation: exported.formation,
                slots: exported.slots,
                cornerKickPlayerId: exported.cornerKickPlayerId,
                freeKickPlayerId: exported.freeKickPlayerId,
                penaltyKickPlayerId: exported.penaltyKickPlayerId,
                saveAt: new Date().toISOString(),
              }
            : preset,
        ),
      );
      setSaveMessage("전술이 수정 저장되었습니다.");
      return;
    }

    const newPreset: SaveTacticPreset = {
      id: crypto.randomUUID(),
      name: presetName.trim(),
      formation: exported.formation,
      slots: exported.slots,
      cornerKickPlayerId: exported.cornerKickPlayerId,
      freeKickPlayerId: exported.freeKickPlayerId,
      penaltyKickPlayerId: exported.penaltyKickPlayerId,
      saveAt: new Date().toISOString(),
    };

    setSavedPresets((prev) => [newPreset, ...prev]);
    setSelectedPresetId(newPreset.id);
    setSaveMessage("전술이 저장되었습니다.");
  };

  // 불러오기 함수
  const handleLoadPreset = (presetId: string) => {
    setSelectedPresetId(presetId);

    const preset = savedPresets.find((item) => item.id === presetId);
    if (!preset) return;

    setPresetName(preset.name);

    tactics.importTactics({
      formation: preset.formation,
      slots: preset.slots,
      cornerKickPlayerId: preset.cornerKickPlayerId,
      freeKickPlayerId: preset.freeKickPlayerId,
      penaltyKickPlayerId: preset.penaltyKickPlayerId,
    });
  };

  // 삭제하기 함수
  const handleDeletePreset = () => {
    if (!selectedPresetId) {
      alert("삭제할 전술을 먼저 선택해주세요.");
      return;
    }
    const confirmed = window.confirm("선택한 전술을 삭제할까요 ?");
    if (!confirmed) return;

    setSavedPresets((prev) =>
      prev.filter((preset) => preset.id !== selectedPresetId),
    );

    setSelectedPresetId("");
  };

  const handleResetTactics = () => {
    tactics.handleResetFormation();
    setPresetName("");
    setSelectedPresetId("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="전술 보드"
        description="포지션을 선택하고 오른쪽 선수 목록에서 배치해 보세요."
      />
      {saveMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {saveMessage}
        </div>
      )}
      <TacticsToolbar
        formation={tactics.formation}
        onChangeFormation={tactics.handleFormationChange}
        onReset={handleResetTactics}
        saveMode="manual"
        presetName={presetName}
        onChangePresetName={setPresetName}
        savedPresets={savedPresets.map((preset) => ({
          id: preset.id,
          name: preset.name,
        }))}
        selectedPresetId={selectedPresetId}
        onLoadPreset={handleLoadPreset}
        onSave={handleSavePreset}
        onDelete={handleDeletePreset}
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
