import {
  findCurrentCaptain,
  findCurrentOwner,
  updatePlayerWithRoles,
} from "@/lib/players/player-role";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { PlayerType, TeamMemberRole } from "@/types/player";

interface UsePlayersPageActionsParams {
  teamId?: string;
  players: PlayerType[];
  addPlayer: (player: PlayerType) => Promise<boolean>;
  deletePlayer: (playerId: string) => Promise<boolean>;
  reloadPlayers: () => Promise<void>;
  handleCloseCreate: () => void;
  handleCloseEdit: () => void;
}

export function usePlayersPageActions({
  teamId,
  players,
  addPlayer,
  deletePlayer,
  reloadPlayers,
  handleCloseCreate,
  handleCloseEdit,
}: Readonly<UsePlayersPageActionsParams>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

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

  const confirmRoleChanges = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
    currentOwner?: PlayerType,
    currentCaptain?: PlayerType,
  ) => {
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

    const confirmed = await confirmRoleChanges(
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

  const handleDeletePlayer = async (player: PlayerType) => {
    const confirmed = await confirm({
      title: "선수 삭제",
      description: `${player.name} 선수를 삭제할까요? 삭제 후에는 되돌릴 수 없어요.`,
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await deletePlayer(player.id);

    if (!success) {
      showToast("선수 삭제에 실패했어요.", "error");
      return;
    }

    showToast("선수를 삭제했어요.", "success");
  };

  return {
    handleCreatePlayer,
    handleEditPlayer,
    handleDeletePlayer,
  };
}
