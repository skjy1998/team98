import { hasCurrentSession } from "@/lib/auth/auth-repository";
import { hasCurrentUserTeam } from "@/lib/team/team-setup-repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useTeamSetupGuard() {
  const router = useRouter();

  const [isCheckingTeam, setIsCheckingTeam] = useState(true);
  const [teamCheckError, setTeamCheckError] = useState("");

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
        setTeamCheckError("팀 정보를 확인하지 못했어요.");
      }

      setIsCheckingTeam(false);
    }

    void checkTeam();
  }, [router]);

  return {
    isCheckingTeam,
    teamCheckError,
  };
}
