import { hasCurrentSession } from "@/lib/auth/auth-repository";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useGuestAuthGuard() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authCheckError, setAuthCheckError] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const hasSession = await hasCurrentSession();

        if (hasSession) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("guest auth check error", error);
        setAuthCheckError("로그인 상태를 확인하지 못했어요.");
      }

      setIsCheckingAuth(false);
    }

    void checkSession();
  }, [router]);

  return {
    isCheckingAuth,
    authCheckError,
  };
}
