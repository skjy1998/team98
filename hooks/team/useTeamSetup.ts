import {
  hasCurrentSession,
  signOutCurrentUser,
} from "@/lib/auth/auth-repository";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import {
  createTeamWithOwner,
  hasCurrentUserTeam,
  joinTeamWithInviteCode,
} from "@/lib/team/team-setup-repository";
import type { TeamSport } from "@/types/team";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type TeamSetupMode = "create" | "join";

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

  const [mode, setMode] = useState<TeamSetupMode>("create");
  const [teamSport, setTeamSport] = useState<TeamSport>("soccer");
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [isCheckingTeam, setIsCheckingTeam] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const changeMode = (nextMode: TeamSetupMode) => {
    setMode(nextMode);
    setErrorMessage("");
  };

  useEffect(() => {
    async function checkTeam() {
      try {
        const hasSession = await hasCurrentSession();

        if (!hasSession) {
          router.replace("/login");
          return;
        }

        const hasTeam = await hasCurrentUserTeam();

        if (hasTeam) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("team setup check error", error);
        setErrorMessage("팀 정보를 확인하지 못했어요.");
      }

      setIsCheckingTeam(false);
    }

    void checkTeam();
  }, [router]);

  const createTeam = async () => {
    const normalizedName = teamName.trim();

    if (!normalizedName || isCreatingTeam) return;

    setIsCreatingTeam(true);
    setErrorMessage("");

    try {
      await createTeamWithOwner({
        name: normalizedName,
        sport: teamSport,
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
    const normalizedInviteCode = inviteCode.trim().toUpperCase();

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
    teamSport,
    setTeamSport,
    teamName,
    setTeamName,
    inviteCode,
    setInviteCode,
    isCreatingTeam,
    isJoiningTeam,
    isCheckingTeam,
    errorMessage,
    createTeam,
    joinTeam,
    logout,
  };
}
