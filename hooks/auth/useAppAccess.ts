import { getAppAccessStatus } from "@/lib/auth/auth-repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAppAccess() {
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
          router.replace("/teams/setup");
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
  }, [router]);

  return {
    isCheckingAccess,
    accessErrorMessage,
  };
}
