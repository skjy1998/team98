import type { SavedFormation, SaveTacticPreset } from "@/types/tactics";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCurrentTeam } from "../team/useCurrentTeam";

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
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState<SaveTacticPreset[]>([]);
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadPresets() {
      if (!teamLoaded) return;

      if (!teamId) {
        setSavedPresets([]);
        setPresetLoaded(true);
        return;
      }

      const { data, error } = await supabase
        .from("team_tactics_presets")
        .select(
          "id, name, formation, slots, corner_kick_player_id, free_kick_player_id, penalty_kick_player_id, updated_at",
        )
        .eq("team_id", teamId)
        .order("updated_at", { ascending: false });

      if (error || !data) {
        setSavedPresets([]);
        setPresetLoaded(true);
        return;
      }

      setSavedPresets(
        data.map((preset) => ({
          id: preset.id,
          name: preset.name,
          formation: preset.formation,
          slots: preset.slots,
          cornerKickPlayerId: preset.corner_kick_player_id ?? "",
          freeKickPlayerId: preset.free_kick_player_id ?? "",
          penaltyKickPlayerId: preset.penalty_kick_player_id ?? "",
          saveAt: preset.updated_at,
        })),
      );

      setPresetLoaded(true);
    }
    loadPresets();
  }, [teamLoaded, teamId]);

  useEffect(() => {
    if (!saveMessage) return;

    const timer = setTimeout(() => {
      setSaveMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [saveMessage]);

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      globalThis.alert("전술 이름을 입력해주세요.");
      return;
    }

    if (!teamId) {
      globalThis.alert("팀 정보를 불러오지 못했어요.");
      return;
    }

    const exported = exportTactics();

    if (selectedPresetId) {
      const updatedAt = new Date().toISOString();

      const { error } = await supabase
        .from("team_tactics_presets")
        .update({
          name: presetName.trim(),
          formation: exported.formation,
          slots: exported.slots,
          corner_kick_player_id: exported.cornerKickPlayerId || null,
          free_kick_player_id: exported.freeKickPlayerId || null,
          penalty_kick_player_id: exported.penaltyKickPlayerId || null,
          updated_at: updatedAt,
        })
        .eq("id", selectedPresetId)
        .eq("team_id", teamId);

      if (error) {
        globalThis.alert("전술 수정 저장에 실패했어요.");
        return;
      }

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
                saveAt: updatedAt,
              }
            : preset,
        ),
      );

      setSaveMessage("전술이 수정 저장되었습니다.");
      return;
    }

    const createdAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("team_tactics_presets")
      .insert({
        team_id: teamId,
        name: presetName.trim(),
        formation: exported.formation,
        slots: exported.slots,
        corner_kick_player_id: exported.cornerKickPlayerId || null,
        free_kick_player_id: exported.freeKickPlayerId || null,
        penalty_kick_player_id: exported.penaltyKickPlayerId || null,
        updated_at: createdAt,
      })
      .select("id")
      .single();

    if (error || !data) {
      globalThis.alert("전술 저장에 실패했어요.");
      return;
    }

    const newPreset: SaveTacticPreset = {
      id: data.id,
      name: presetName.trim(),
      formation: exported.formation,
      slots: exported.slots,
      cornerKickPlayerId: exported.cornerKickPlayerId,
      freeKickPlayerId: exported.freeKickPlayerId,
      penaltyKickPlayerId: exported.penaltyKickPlayerId,
      saveAt: createdAt,
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

  const handleDeletePreset = async () => {
    if (!selectedPresetId) {
      globalThis.alert("삭제할 전술을 먼저 선택해주세요.");
      return;
    }

    if (!teamId) {
      globalThis.alert("팀 정보를 불러오지 못했어요.");
      return;
    }

    const confirmed = globalThis.confirm("선택한 전술을 삭제할까요?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("team_tactics_presets")
      .delete()
      .eq("id", selectedPresetId)
      .eq("team_id", teamId);

    if (error) {
      globalThis.alert("전술 삭제에 실패했어요.");
      return;
    }

    setSavedPresets((prev) =>
      prev.filter((preset) => preset.id !== selectedPresetId),
    );
    setSelectedPresetId("");
    setPresetName("");
    setSaveMessage("전술이 삭제되었습니다.");
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
    presetLoaded,
    handleSavePreset,
    handleLoadPreset,
    handleDeletePreset,
    handleResetPresetState,
  };
}
