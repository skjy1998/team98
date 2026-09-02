import { supabase } from "../supabase";

export type AppAccessStatus = "unauthenticated" | "team-required" | "granted";

export interface CurrentUserSummary {
  name: string;
  email: string;
}

export async function getCurrentUserSummary(): Promise<CurrentUserSummary> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("authenticated user not found");

  const metadataName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name.trim()
      : "";

  return {
    name: metadataName || user.email?.split("@")[0] || "사용자",
    email: user.email ?? "",
  };
}

export async function signOutCurrentUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function hasCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  return Boolean(session);
}

export async function signInCurrentUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("authenticated user not found");

  return data.user.id;
}

export async function hasTeamMembership(userId: string) {
  const { data, error } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function signUpCurrentUser(
  name: string,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("created user not found");
}

export async function getAppAccessStatus(): Promise<AppAccessStatus> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return "unauthenticated";

  const { data: membership, error: membershipError } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) throw membershipError;

  return membership ? "granted" : "team-required";
}
