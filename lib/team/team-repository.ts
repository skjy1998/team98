import type { CurrentTeam } from "@/types/team";
import { supabase } from "../supabase";

interface TeamMembershipRow {
  team_id: string;
}

interface TeamRow {
  id: string;
  name: string;
  sport: CurrentTeam["sport"];
  invite_code: string;
}

export async function getCurrentUserTeam(): Promise<CurrentTeam | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data: membershipData, error: membershipError } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) throw membershipError;
  if (!membershipData) return null;

  const membership = membershipData as TeamMembershipRow;

  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select("id, name, sport, invite_code")
    .eq("id", membership.team_id)
    .maybeSingle();

  if (teamError) throw teamError;
  if (!teamData) return null;

  const team = teamData as TeamRow;

  return {
    id: team.id,
    name: team.name,
    sport: team.sport,
    inviteCode: team.invite_code,
  };
}
