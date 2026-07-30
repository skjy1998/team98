import { supabase } from "@/lib/supabase";
import type {
  ConnectableTeamMember,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { useEffect, useMemo, useState } from "react";

interface UseConnectableTeamMembersParams {
  teamId?: string;
  players: PlayerType[];
  editingPlayer: PlayerType | null;
}

function getConnectableMemberLabel(member: {
  display_name: string | null;
  user_id: string;
}) {
  return member.display_name || member.user_id;
}

export function useConnectableTeamMembers({
  teamId,
  players,
  editingPlayer,
}: Readonly<UseConnectableTeamMembersParams>) {
  const [connectableMembers, setConnectableMembers] = useState<
    ConnectableTeamMember[]
  >([]);
  const [membersLoaded, setMembersLoaded] = useState(false);

  useEffect(() => {
    async function loadConnectableMembers() {
      if (!teamId) {
        setConnectableMembers([]);
        setMembersLoaded(true);
        return;
      }

      setMembersLoaded(false);

      const { data, error } = await supabase
        .from("team_members")
        .select("user_id, role, display_name")
        .eq("team_id", teamId);

      if (error || !data) {
        setConnectableMembers([]);
        setMembersLoaded(true);
        return;
      }

      const members = data.map((member) => ({
        userId: member.user_id,
        role: member.role as TeamMemberRole,
        label: getConnectableMemberLabel(member),
      }));

      setConnectableMembers(members);
      setMembersLoaded(true);
    }

    loadConnectableMembers();
  }, [teamId]);

  const availableMembers = useMemo(() => {
    if (!editingPlayer) {
      return connectableMembers;
    }

    const usedUserIds = new Set(
      players
        .filter((player) => player.userId && player.id !== editingPlayer.id)
        .map((player) => player.userId as string),
    );

    return connectableMembers.filter(
      (member) =>
        !usedUserIds.has(member.userId) ||
        member.userId === editingPlayer.userId,
    );
  }, [connectableMembers, editingPlayer, players]);

  return { availableMembers, membersLoaded };
}
