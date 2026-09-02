import type { SavedFormation, SaveTacticPreset } from "@/types/tactics";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "../team/useCurrentTeam";
import { useToastStore } from "@/stores/toast-store";
import { useConfirmStore } from "@/stores/confirm-store";
import {
  createTeamTacticsPreset,
  deleteTeamTacticsPreset,
  getTeamTacticsPresets,
  updateTeamTacticsPreset,
} from "@/lib/tactics/tactics-preset-repository";

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
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<SaveTacticPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [presetError, setPresetError] = useState("");

  const loadPresets = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setSavedPresets([]);
      setPresetLoaded(true);
      setPresetError("");
      return;
    }

    setPresetLoaded(false);
    setPresetError("");

    try {
      const presets = await getTeamTacticsPresets(teamId);
      setSavedPresets(presets);
    } catch (error) {
      console.error("tactics presets load error", error);
      setSavedPresets([]);
      setPresetError("저장된 전술을 불러오지 못했어요.");
    } finally {
      setPresetLoaded(true);
    }
  }, [teamId, teamLoaded]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPresets();
  }, [loadPresets]);

  const handleSavePreset = async () => {
    const trimmedName = presetName.trim();

    if (!trimmedName) {
      showToast("전술 이름을 입력해 주세요.", "info");
      return;
    }

    if (!teamId) {
      showToast("팀 정보를 불러오지 못했어요.", "error");
      return;
    }

    const presetValue = {
      name: trimmedName,
      ...exportTactics(),
    };

    try {
      if (selectedPresetId) {
        const updatedPreset = await updateTeamTacticsPreset(
          teamId,
          selectedPresetId,
          presetValue,
        );

        setSavedPresets((previous) =>
          previous.map((preset) =>
            preset.id === selectedPresetId ? updatedPreset : preset,
          ),
        );

        showToast("전술을 수정했어요.", "success");
        return;
      }

      const createdPreset = await createTeamTacticsPreset(teamId, presetValue);

      setSavedPresets((previous) => [createdPreset, ...previous]);
      setSelectedPresetId(createdPreset.id);
      showToast("전술을 저장했어요.", "success");
    } catch (error) {
      console.error("tactics preset save error", error);

      showToast(
        selectedPresetId
          ? "전술 수정 저장에 실패했어요."
          : "전술 저장에 실패했어요.",
        "error",
      );
    }
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

  const handleDeletePreset = async () => {
    if (!selectedPresetId) {
      showToast("삭제할 전술을 먼저 선택해 주세요.", "info");
      return;
    }

    if (!teamId) {
      showToast("팀 정보를 불러오지 못했어요.", "error");
      return;
    }

    const confirmed = await confirm({
      title: "저장 전술 삭제",
      description: "선택한 전술을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      const deleted = await deleteTeamTacticsPreset(teamId, selectedPresetId);

      if (!deleted) {
        throw new Error("삭제할 전술을 찾을 수 없어요.");
      }

      setSavedPresets((previous) =>
        previous.filter((preset) => preset.id !== selectedPresetId),
      );
      setSelectedPresetId("");
      setPresetName("");
      showToast("전술을 삭제했어요.", "success");
    } catch (error) {
      console.error("tactics preset delete error", error);
      showToast("전술 삭제에 실패했어요.", "error");
    }
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
    presetLoaded,
    presetError,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleResetPresetState,
    reloadPresets: loadPresets,
  };
}
