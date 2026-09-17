import type { CurrentTeam } from "@/types/team";
import { supabase } from "../supabase";
import type { TeamMemberRole } from "@/types/player";

interface TeamMembershipRow {
  team_id: string;
  role: TeamMemberRole;
}

interface TeamRow {
  id: string;
  name: string;
  sport: CurrentTeam["sport"];
  invite_code: string;
}

export async function getCurrentUserTeams(): Promise<CurrentTeam[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data: memberships, error: membershipError } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true });

  if (membershipError) throw membershipError;
  if (!memberships?.length) return [];

  const orderedMemberships = memberships as TeamMembershipRow[];
  const teamIds = orderedMemberships.map((membership) => membership.team_id);

  const { data: teams, error: teamError } = await supabase
    .from("teams")
    .select("id, name, sport, invite_code")
    .in("id", teamIds);

  if (teamError) throw teamError;

  const teamById = new Map(
    ((teams ?? []) as TeamRow[]).map((team) => [team.id, team]),
  );

  return orderedMemberships.flatMap((membership) => {
    const team = teamById.get(membership.team_id);

    return team
      ? [
          {
            id: team.id,
            name: team.name,
            sport: team.sport,
            inviteCode: team.invite_code,
            memberRole: membership.role,
          },
        ]
      : [];
  });
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
    .select("team_id, role")
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
    memberRole: membership.role,
  };
}
