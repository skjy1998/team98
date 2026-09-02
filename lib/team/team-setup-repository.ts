import type { CurrentTeam } from "@/types/team";
import { supabase } from "../supabase";

interface SetupUser {
  id: string;
  displayName: string | null;
}

interface CreateTeamInput {
  name: string;
  sport: CurrentTeam["sport"];
  inviteCode: string;
}

async function getSetupUser(): Promise<SetupUser> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("로그인 정보를 확인할 수 없어요.");

  const displayName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : null;

  return {
    id: user.id,
    displayName,
  };
}

export async function hasCurrentUserTeam() {
  const user = await getSetupUser();

  const { data, error } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function createTeamWithOwner({
  name,
  sport,
  inviteCode,
}: CreateTeamInput) {
  const { data, error } = await supabase.rpc("create_team_with_owner", {
    p_name: name,
    p_sport: sport,
    p_invite_code: inviteCode,
  });

  if (error) throw error;
  if (!data) throw new Error("생성된 팀 정보를 확인할 수 없어요.");

  return data as string;
}

export async function joinTeamWithInviteCode(inviteCode: string) {
  const user = await getSetupUser();

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  if (teamError) throw teamError;
  if (!team) {
    throw new Error("일치하는 팀 초대코드를 찾을 수 없어요.");
  }

  const { error: memberError } = await supabase.from("team_members").insert({
    team_id: team.id,
    user_id: user.id,
    role: "member",
    display_name: user.displayName,
  });

  if (memberError) throw memberError;

  return team.id;
}
