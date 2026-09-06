import {
  findCurrentCaptain,
  findCurrentOwner,
} from "@/lib/players/player-role";
import { useConfirmStore } from "@/stores/confirm-store";
import type { PlayerType, TeamMemberRole } from "@/types/player";

export function usePlayerRoleChangeConfirmation(players: PlayerType[]) {
  const confirm = useConfirmStore((state) => state.confirm);

  const confirmRoleChanges = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => {
    const currentOwner = findCurrentOwner(players, player.id);
    const currentCaptain = findCurrentCaptain(players, player.id);

    if (teamRole === "owner" && currentOwner) {
      const confirmed = await confirm({
        title: "회장 변경",
        description: `${currentOwner.name}님이 현재 회장이에요. 기존 회장을 일반 회원으로 변경하고 ${player.name}님을 새 회장으로 지정할까요?`,
        confirmLabel: "변경",
      });

      if (!confirmed) return false;
    }

    if (player.role === "captain" && currentCaptain) {
      const confirmed = await confirm({
        title: "주장 변경",
        description: `${currentCaptain.name}님이 현재 주장이에요. 기존 주장을 일반 회원으로 변경하고 ${player.name}님을 새 주장으로 지정할까요?`,
        confirmLabel: "변경",
      });

      if (!confirmed) return false;
    }

    return true;
  };

  return { confirmRoleChanges };
}
