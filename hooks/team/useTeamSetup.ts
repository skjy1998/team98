import { signOutCurrentUser } from "@/lib/auth/auth-repository";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import {
  createTeamWithOwner,
  joinTeamWithInviteCode,
} from "@/lib/team/team-setup-repository";
import type { TeamSport } from "@/types/team";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTeamSetupGuard } from "./useTeamSetupGuard";

export type TeamSetupMode = "create" | "join";

interface TeamSetupFormState {
  teamSport: TeamSport;
  teamName: string;
  inviteCode: string;
}

function createInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function hasErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export function useTeamSetup() {
  const router = useRouter();
  const { isCheckingTeam, teamCheckError } = useTeamSetupGuard();

  const [mode, setMode] = useState<TeamSetupMode>("create");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<TeamSetupFormState>({
    teamSport: "soccer",
    teamName: "",
    inviteCode: "",
  });

  const updateField = <Key extends keyof TeamSetupFormState>(
    key: Key,
    value: TeamSetupFormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const changeMode = (nextMode: TeamSetupMode) => {
    setMode(nextMode);
    setErrorMessage("");
  };

  const createTeam = async () => {
    const normalizedName = form.teamName.trim();

    if (!normalizedName || isCreatingTeam) return;

    setIsCreatingTeam(true);
    setErrorMessage("");

    try {
      await createTeamWithOwner({
        name: normalizedName,
        sport: form.teamSport,
        inviteCode: createInviteCode(),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("team creation error", error);
      setErrorMessage(getAuthErrorMessage(error, "팀 생성에 실패했어요."));
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const joinTeam = async () => {
    const normalizedInviteCode = form.inviteCode.trim().toUpperCase();

    if (!normalizedInviteCode || isJoiningTeam) return;

    setIsJoiningTeam(true);
    setErrorMessage("");

    try {
      await joinTeamWithInviteCode(normalizedInviteCode);
      router.push("/dashboard");
    } catch (error) {
      console.error("team join error", error);

      if (hasErrorCode(error, "23505")) {
        setErrorMessage("이미 참가한 팀이에요.");
      } else {
        setErrorMessage(getAuthErrorMessage(error, "팀 참가에 실패했어요."));
      }
    } finally {
      setIsJoiningTeam(false);
    }
  };

  const logout = async () => {
    try {
      await signOutCurrentUser();
      router.push("/login");
    } catch (error) {
      console.error("team setup logout error", error);
      setErrorMessage("로그아웃에 실패했어요.");
    }
  };

  return {
    mode,
    changeMode,
    form,
    updateField,
    isCreatingTeam,
    isJoiningTeam,
    isCheckingTeam,
    errorMessage: teamCheckError || errorMessage,
    createTeam,
    joinTeam,
    logout,
  };
}
