import type { TeamMemberRole } from "@/types/player";
import { supabase } from "../supabase";

interface TeamMemberRow {
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
}

export interface CurrentTeamMember {
  userId: string;
  teamId: string;
  role: TeamMemberRole;
}

export async function getCurrentTeamMember(teamId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from("team_members")
    .select("team_id, user_id, role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const member = data as TeamMemberRow;

  return {
    teamId: member.team_id,
    userId: member.user_id,
    role: member.role,
  } satisfies CurrentTeamMember;
}
