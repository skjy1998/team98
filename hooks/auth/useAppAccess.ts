import { getAppAccessStatus } from "@/lib/auth/auth-repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAppAccessOptions {
  allowWithoutTeam?: boolean;
}

export function useAppAccess({
  allowWithoutTeam = false,
}: Readonly<UseAppAccessOptions> = {}) {
  const router = useRouter();

  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [accessErrorMessage, setAccessErrorMessage] = useState("");

  useEffect(() => {
    async function checkAccess() {
      try {
        const status = await getAppAccessStatus();

        if (status === "unauthenticated") {
          router.replace("/login");
          return;
        }

        if (status === "team-required") {
          if (allowWithoutTeam) {
            setIsCheckingAccess(false);
            return;
          }

          router.replace("/teams/add");
          return;
        }

        setIsCheckingAccess(false);
      } catch (error) {
        console.error("app access check error", error);
        setAccessErrorMessage("팀 접근 권한을 확인하지 못했어요.");
        setIsCheckingAccess(false);
      }
    }

    void checkAccess();
  }, [allowWithoutTeam, router]);

  return {
    isCheckingAccess,
    accessErrorMessage,
  };
}
