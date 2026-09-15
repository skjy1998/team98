import { useCurrentTeam } from "../team/useCurrentTeam";
import { useCurrentTeamMember } from "../team/useCurrentTeamMember";
import { useTacticsBoard } from "./useTacticsBoard";
import { useTacticsPresets } from "./useTacticsPresets";
import { sortPlayersByRecommendedPosition } from "@/lib/tactics/tactics-ui";

export type TacticsPageData = ReturnType<typeof useTacticsPageData>;

export function useTacticsPageData() {
  const { teamLoaded, teamError, reloadTeam } = useCurrentTeam();

  const { canManage, memberLoaded, memberError, reloadMember } =
    useCurrentTeamMember();

  const tactics = useTacticsBoard();

  const presets = useTacticsPresets({
    exportTactics: tactics.exportTactics,
    importTactics: tactics.importTactics,
    resetTactics: tactics.handleResetTactics,
  });

  const sortedAvailablePlayers = sortPlayersByRecommendedPosition(
    tactics.availablePlayers,
    tactics.selectedSlot,
  );

  const presetOptions = presets.savedPresets.map((preset) => ({
    id: preset.id,
    name: preset.name,
  }));

  const isLoaded =
    teamLoaded && memberLoaded && tactics.playersLoaded && presets.presetLoaded;

  const pageError =
    teamError || memberError || tactics.playersError || presets.presetError;

  const reloadPageData = async () => {
    await Promise.all([
      reloadTeam(),
      reloadMember(),
      tactics.reloadPlayers(),
      presets.reloadPresets(),
    ]);
  };

  return {
    canManage,
    isLoaded,
    pageError,
    reloadPageData,
    tactics,
    presets,
    sortedAvailablePlayers,
    presetOptions,
  };
}
