import { updateTeamPlayerWithRoles } from "@/lib/players/player-repository";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { PlayerType, TeamMemberRole } from "@/types/player";
import { usePlayerRoleChangeConfirmation } from "./usePlayerRoleChangeConfirmation";

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

  const { confirmRoleChanges } = usePlayerRoleChangeConfirmation(players);

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

    const confirmed = await confirmRoleChanges(player, teamRole);

    if (!confirmed) return;

    try {
      await updateTeamPlayerWithRoles(teamId, player, teamRole);
      await reloadPlayers();

      showToast("선수 정보를 수정했어요.", "success");
      handleCloseEdit();
    } catch (error) {
      console.error("player update error", error);
      showToast("선수 정보 저장에 실패했어요.", "error");
    }
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
