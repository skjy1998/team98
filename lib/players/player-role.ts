import type { ConnectableTeamMember, PlayerType } from "@/types/player";

export function findCurrentOwner(players: PlayerType[], playerId: string) {
  return players.find(
    (player) => player.id !== playerId && player.teamMemberRole === "owner",
  );
}

export function findCurrentCaptain(players: PlayerType[], playerId: string) {
  return players.find(
    (player) => player.id !== playerId && player.role === "captain",
  );
}

export function getAvailableConnectableTeamMembers(
  members: ConnectableTeamMember[],
  players: PlayerType[],
  editingPlayer: PlayerType | null,
) {
  if (!editingPlayer) {
    return members;
  }

  const usedUserIds = new Set(
    players.flatMap((player) =>
      player.userId && player.id !== editingPlayer.id ? [player.userId] : [],
    ),
  );

  return members.filter(
    (member) =>
      !usedUserIds.has(member.userId) || member.userId === editingPlayer.userId,
  );
}
