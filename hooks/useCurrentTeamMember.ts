import { useEffect, useState } from "react";
import { useCurrentTeam } from "./useCurrentTeam";
import { supabase } from "@/lib/supabase";
import type { TeamMemberRole } from "@/types/player";

interface CurrentTeamMember {
  userId: string;
  teamId: string;
  role: TeamMemberRole;
}

export function useCurrentTeamMember() {
  const { team, teamLoaded } = useCurrentTeam();

  const [member, setMember] = useState<CurrentTeamMember | null>(null);
  const [memberLoaded, setMemberLoaded] = useState(false);

  useEffect(() => {
    async function loadCurrentTeamMember() {
      if (!teamLoaded) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !team?.id) {
        setMember(null);
        setMemberLoaded(true);
        return;
      }

      setMemberLoaded(false);

      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, user_id, role")
        .eq("team_id", team.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        setMember(null);
        setMemberLoaded(true);
        return;
      }

      setMember({
        teamId: data.team_id,
        userId: data.user_id,
        role: data.role as TeamMemberRole,
      });
      setMemberLoaded(true);
    }

    loadCurrentTeamMember();
  }, [teamLoaded, team?.id]);

  const canManage = member?.role === "owner" || member?.role === "staff";

  return {
    member,
    memberLoaded,
    memberRole: member?.role ?? null,
    canManage,
  };
}
