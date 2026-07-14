import { supabase } from "@/lib/supabase";
import type { PlayerType, TeamMemberRole } from "@/types/player";

interface UsePlayersPageActionsParams {
  teamId?: string;
  players: PlayerType[];
  addPlayer: (player: PlayerType) => Promise<boolean>;
  updatePlayer: (player: PlayerType) => Promise<boolean>;
  deletePlayer: (playerId: string) => Promise<boolean>;
  reloadPlayers: () => Promise<void>;
  deletingPlayer: PlayerType | null;
  handleCloseCreate: () => void;
  handleCloseEdit: () => void;
  handleCloseDelete: () => void;
}

function findCurrentOwner(players: PlayerType[], playerId: string) {
  return players.find(
    (item) => item.id !== playerId && item.teamMemberRole === "owner",
  );
}

function findCurrentCaptain(players: PlayerType[], playerId: string) {
  return players.find(
    (item) => item.id !== playerId && item.role === "captain",
  );
}

async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: TeamMemberRole,
) {
  return supabase
    .from("team_members")
    .update({ role })
    .eq("team_id", teamId)
    .eq("user_id", userId);
}

export function usePlayersPageActions({
  teamId,
  players,
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
      return;
    }

    globalThis.alert("선수 추가에 실패했어요.");
  };

  const handleEditPlayer = async (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => {
    const currentOwner = findCurrentOwner(players, player.id);
    const currentCaptain = findCurrentCaptain(players, player.id);

    if (teamRole === "owner" && currentOwner) {
      const confirmed = globalThis.confirm(
        `${currentOwner.name}님이 현재 회장이에요. 기존 회장을 일반 회원으로 변경하고 ${player.name}님을 새 회장으로 지정할까요?`,
      );

      if (!confirmed) {
        return;
      }
    }

    if (player.role === "captain" && currentCaptain) {
      const confirmed = globalThis.confirm(
        `${currentCaptain.name}님이 현재 주장이에요. 기존 주장을 일반 회원으로 변경하고 ${player.name}님을 새 주장으로 지정할까요?`,
      );

      if (!confirmed) {
        return;
      }
    }

    if (teamId && teamRole === "owner" && currentOwner?.userId) {
      const { error: demoteOwnerError } = await updateTeamMemberRole(
        teamId,
        currentOwner.userId,
        "member",
      );

      if (demoteOwnerError) {
        globalThis.alert("기존 회장 변경에 실패했어요.");
        return;
      }
    }

    if (currentCaptain && player.role === "captain") {
      const demoteCaptainSuccess = await updatePlayer({
        ...currentCaptain,
        role: "member",
      });

      if (!demoteCaptainSuccess) {
        globalThis.alert("기존 주장 변경에 실패했어요.");
        return;
      }
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

    if (teamId && nextPlayer.userId) {
      const { error } = await updateTeamMemberRole(
        teamId,
        nextPlayer.userId,
        teamRole,
      );

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
      return;
    }

    globalThis.alert("선수 삭제에 실패했어요.");
  };

  return {
    handleCreatePlayer,
    handleEditPlayer,
    handleDeletePlayer,
  };
}
