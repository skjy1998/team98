import {
  findCurrentCaptain,
  findCurrentOwner,
  updatePlayerWithRoles,
} from "@/lib/players/player-role";
import { useToastStore } from "@/stores/toast-store";
import type { PlayerType, TeamMemberRole } from "@/types/player";

interface UsePlayersPageActionsParams {
  teamId?: string;
  players: PlayerType[];
  addPlayer: (player: PlayerType) => Promise<boolean>;
  deletePlayer: (playerId: string) => Promise<boolean>;
  reloadPlayers: () => Promise<void>;
  deletingPlayer: PlayerType | null;
  handleCloseCreate: () => void;
  handleCloseEdit: () => void;
  handleCloseDelete: () => void;
}

export function usePlayersPageActions({
  teamId,
  players,
  addPlayer,
  deletePlayer,
  reloadPlayers,
  deletingPlayer,
  handleCloseCreate,
  handleCloseEdit,
  handleCloseDelete,
}: Readonly<UsePlayersPageActionsParams>) {
  const showToast = useToastStore((state) => state.showToast);

  // 생성 수정 삭제 액션
  const handleCreatePlayer = async (player: PlayerType) => {
    const success = await addPlayer(player);

    if (success) {
      showToast("선수를 추가했어요.", "success");
      handleCloseCreate();
      return;
    }

    showToast("선수 추가에 실패했어요.", "error");
  };

  const confirmRoleChanges = (
    player: PlayerType,
    teamRole: TeamMemberRole,
    currentOwner?: PlayerType,
    currentCaptain?: PlayerType,
  ) => {
    if (teamRole === "owner" && currentOwner) {
      const confirmed = globalThis.confirm(
        `${currentOwner.name}님이 현재 회장이에요. 기존 회장을 일반 회원으로 변경하고 ${player.name}님을 새 회장으로 지정할까요?`,
      );

      if (!confirmed) return false;
    }

    if (player.role === "captain" && currentCaptain) {
      const confirmed = globalThis.confirm(
        `${currentCaptain.name}님이 현재 주장이에요. 기존 주장을 일반 회원으로 변경하고 ${player.name}님을 새 주장으로 지정할까요?`,
      );

      if (!confirmed) return false;
    }

    return true;
  };

  const handleEditPlayer = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => {
    if (!teamId) {
      showToast("팀 정보를 확인할 수 없어요.", "error");
      return;
    }

    if ((teamRole === "owner" || teamRole === "staff") && !player.userId) {
      showToast(
        "회장 또는 운영진으로 지정하려면 먼저 사용자 계정을 연결해주세요.",
        "info",
      );
      return;
    }

    const currentOwner = findCurrentOwner(players, player.id);
    const currentCaptain = findCurrentCaptain(players, player.id);

    const confirmed = confirmRoleChanges(
      player,
      teamRole,
      currentOwner,
      currentCaptain,
    );

    if (!confirmed) return;

    const success = await updatePlayerWithRoles(teamId, player, teamRole);

    if (!success) {
      showToast("선수 정보 저장에 실패했어요.", "error");
      return;
    }

    await reloadPlayers();
    showToast("선수 정보를 수정했어요.", "success");
    handleCloseEdit();
  };

  const handleDeletePlayer = async () => {
    if (!deletingPlayer) return;

    const success = await deletePlayer(deletingPlayer.id);

    if (success) {
      showToast("선수를 삭제했어요.", "success");
      handleCloseDelete();
      return;
    }

    showToast("선수 삭제에 실패했어요.", "error");
  };

  return {
    handleCreatePlayer,
    handleEditPlayer,
    handleDeletePlayer,
  };
}
