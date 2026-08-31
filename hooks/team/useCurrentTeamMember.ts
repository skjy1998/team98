import { useCallback, useEffect, useState } from "react";
import { useCurrentTeam } from "./useCurrentTeam";
import {
  type CurrentTeamMember,
  getCurrentTeamMember,
} from "@/lib/team/team-member-repository";

export function useCurrentTeamMember() {
  const { team, teamLoaded } = useCurrentTeam();
  const teamId = team?.id;

  const [member, setMember] = useState<CurrentTeamMember | null>(null);
  const [memberLoaded, setMemberLoaded] = useState(false);
  const [memberError, setMemberError] = useState("");

  const loadCurrentTeamMember = useCallback(async () => {
    if (!teamLoaded) return;

    if (!teamId) {
      setMember(null);
      setMemberLoaded(true);
      setMemberError("");
      return;
    }

    setMemberLoaded(false);
    setMemberError("");

    try {
      const nextMember = await getCurrentTeamMember(teamId);
      setMember(nextMember);
    } catch (error) {
      console.error("current team member load error", error);
      setMember(null);
      setMemberError("팀 권한 정보를 불러오지 못했어요.");
    } finally {
      setMemberLoaded(true);
    }
  }, [teamLoaded, teamId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCurrentTeamMember();
  }, [loadCurrentTeamMember]);

  const canManage = member?.role === "owner" || member?.role === "staff";

  return {
    member,
    memberLoaded,
    memberError,
    memberRole: member?.role ?? null,
    canManage,
    reloadMember: loadCurrentTeamMember,
  };
}
