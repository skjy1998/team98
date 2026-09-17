import { useRouter } from "next/navigation";
import { useCurrentTeam } from "./useCurrentTeam";
import { useState } from "react";
import { TeamEntryMode, TeamSport } from "@/types/team";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import {
  createTeamWithOwner,
  joinTeamWithInviteCode,
} from "@/lib/team/team-setup-repository";

export function useTeamAdd() {
  const router = useRouter();
  const { reloadTeam } = useCurrentTeam();

  const [mode, setMode] = useState<TeamEntryMode>("create");
  const [teamName, setTeamName] = useState("");
  const [teamSport, setTeamSport] = useState<TeamSport>("soccer");
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const changeMode = (nextMode: TeamEntryMode) => {
    setMode(nextMode);
    setErrorMessage("");
  };

  const submit = async (
    action: () => Promise<string>,
    fallbackMessage: string,
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const teamId = await action();

      globalThis.localStorage.setItem("squadflow.activeTeamId", teamId);
      await reloadTeam();
      router.replace("/dashboard");
    } catch (error) {
      console.error("team add error", error);
      setErrorMessage(getAuthErrorMessage(error, fallbackMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const createTeam = async () => {
    if (!teamName.trim()) return;

    await submit(
      () =>
        createTeamWithOwner({
          name: teamName.trim(),
          sport: teamSport,
          inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        }),
      "팀 생성에 실패했어요.",
    );
  };

  const joinTeam = async () => {
    if (!inviteCode.trim()) return;

    await submit(
      () => joinTeamWithInviteCode(inviteCode.trim().toUpperCase()),
      "팀 참가에 실패했어요.",
    );
  };

  return {
    mode,
    changeMode,
    teamName,
    setTeamName,
    teamSport,
    setTeamSport,
    inviteCode,
    setInviteCode,
    isSubmitting,
    errorMessage,
    createTeam,
    joinTeam,
  };
}
