import { supabase } from "@/lib/supabase";
import type { PlayerType, TeamMemberRole } from "@/types/player";

interface TeamLike {
  id?: string;
}

interface UsePlayersPageActionsParams {
  team: TeamLike | null;
  addPlayer: (player: PlayerType) => Promise<boolean>;
  updatePlayer: (player: PlayerType) => Promise<boolean>;
  deletePlayer: (playerId: string) => Promise<boolean>;
  reloadPlayers: () => Promise<void>;
  deletingPlayer: PlayerType | null;
  handleCloseCreate: () => void;
  handleCloseEdit: () => void;
  handleCloseDelete: () => void;
}

export function usePlayersPageActions({
  team,
  addPlayer,
  updatePlayer,
  deletePlayer,
  reloadPlayers,
  deletingPlayer,
  handleCloseCreate,
  handleCloseEdit,
  handleCloseDelete,
}: Readonly<UsePlayersPageActionsParams>) {
  // 생성 수정 삭제 액션
  const handleCreatePlayer = async (player: PlayerType) => {
    const success = await addPlayer(player);

    if (success) {
      handleCloseCreate();
    }
  };

  const handleEditPlayer = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => {
    if (!team?.id) {
      globalThis.alert("현재 팀 정보를 불러오지 못했어요.");
      return;
    }

    const nextPlayer = {
      ...player,
      teamMemberRole: teamRole,
    };

    const playerSuccess = await updatePlayer(nextPlayer);

    if (!playerSuccess) {
      globalThis.alert("선수 정보 저장에 실패했어요.");
      return;
    }

    if (nextPlayer.userId) {
      const { error } = await supabase
        .from("team_members")
        .update({ role: teamRole })
        .eq("team_id", team.id)
        .eq("user_id", nextPlayer.userId);

      if (error) {
        globalThis.alert(error.message);
        return;
      }
    }
    await reloadPlayers();
    handleCloseEdit();
  };

  const handleDeletePlayer = async () => {
    if (!deletingPlayer) return;

    const success = await deletePlayer(deletingPlayer.id);

    if (success) {
      handleCloseDelete();
    }
  };

  return {
    handleCreatePlayer,
    handleEditPlayer,
    handleDeletePlayer,
  };
}
