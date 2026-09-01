import { supabase } from "../supabase";

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
