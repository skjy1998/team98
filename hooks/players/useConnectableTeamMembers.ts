import { getConnectableTeamMembers } from "@/lib/players/player-repository";
import { getAvailableConnectableTeamMembers } from "@/lib/players/player-role";
import type { ConnectableTeamMember, PlayerType } from "@/types/player";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseConnectableTeamMembersParams {
  teamId?: string;
  players: PlayerType[];
  editingPlayer: PlayerType | null;
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
  const [membersError, setMembersError] = useState("");

  const loadConnectableMembers = useCallback(async () => {
    if (!teamId) {
      setConnectableMembers([]);
      setMembersLoaded(true);
      setMembersError("");
      return;
    }

    setMembersLoaded(false);
    setMembersError("");

    try {
      const members = await getConnectableTeamMembers(teamId);
      setConnectableMembers(members);
    } catch (error) {
      console.error("connectable team members load error", error);
      setConnectableMembers([]);
      setMembersError("연결 가능한 팀원을 불러오지 못했어요.");
    } finally {
      setMembersLoaded(true);
    }
  }, [teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConnectableMembers();
  }, [loadConnectableMembers]);

  const availableMembers = useMemo(
    () =>
      getAvailableConnectableTeamMembers(
        connectableMembers,
        players,
        editingPlayer,
      ),
    [connectableMembers, players, editingPlayer],
  );

  return {
    availableMembers,
    membersLoaded,
    membersError,
    reloadMembers: loadConnectableMembers,
  };
}
