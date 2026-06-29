import { SavedFormation, SaveTacticPreset } from "@/types/tactics";
import { useEffect, useState } from "react";

interface UseTacticsPresetsParams {
  exportTactics: () => SavedFormation;
  importTactics: (data: SavedFormation) => void;
  resetTactics: () => void;
}

export function useTacticsPresets({
  exportTactics,
  importTactics,
  resetTactics,
}: UseTacticsPresetsParams) {
  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<SaveTacticPreset[]>([]);
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tactics-presets");

    if (saved && saved !== "undefined") {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedPresets(JSON.parse(saved));
      } catch {
        localStorage.removeItem("tactics-presets");
      }
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

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      alert("전술 이름을 입력해주세요.");
      return;
    }

    const exported = exportTactics();

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

  const handleLoadPreset = (presetId: string) => {
    setSelectedPresetId(presetId);

    const preset = savedPresets.find((item) => item.id === presetId);
    if (!preset) return;

    setPresetName(preset.name);

    importTactics({
      formation: preset.formation,
      slots: preset.slots,
      cornerKickPlayerId: preset.cornerKickPlayerId,
      freeKickPlayerId: preset.freeKickPlayerId,
      penaltyKickPlayerId: preset.penaltyKickPlayerId,
    });
  };

  const handleDeletePreset = () => {
    if (!selectedPresetId) {
      alert("삭제할 전술을 먼저 선택해주세요.");
      return;
    }
    const confirmed = globalThis.confirm("선택한 전술을 삭제할까요 ?");
    if (!confirmed) return;

    setSavedPresets((prev) =>
      prev.filter((preset) => preset.id !== selectedPresetId),
    );

    setSelectedPresetId("");
  };

  const handleResetPresetState = () => {
    resetTactics();
    setPresetName("");
    setSelectedPresetId("");
  };

  return {
    presetName,
    setPresetName,
    savedPresets,
    selectedPresetId,
    saveMessage,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleResetPresetState,
  };
}
