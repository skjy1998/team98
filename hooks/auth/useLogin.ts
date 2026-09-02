import {
  hasCurrentSession,
  hasTeamMembership,
  signInCurrentUser,
} from "@/lib/auth/auth-repository";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const hasSession = await hasCurrentSession();

        if (hasSession) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("login session check error", error);
        setErrorMessage("로그인 상태를 확인하지 못했어요.");
      }

      setIsCheckingAuth(false);
    }

    void checkSession();
  }, [router]);

  const login = async ({ email, password }: LoginCredentials) => {
    setErrorMessage("");

    let userId: string;

    try {
      userId = await signInCurrentUser(email.trim(), password);
    } catch (error) {
      console.error("login error", error);
      setErrorMessage(getAuthErrorMessage(error, "로그인에 실패했어요."));
      return;
    }

    try {
      const hasMembership = await hasTeamMembership(userId);

      router.push(hasMembership ? "/dashboard" : "/teams/setup");
    } catch (error) {
      console.error("team membership check error", error);
      setErrorMessage("팀 정보를 확인하는 중 문제가 발생했어요.");
    }
  };

  return {
    errorMessage,
    isCheckingAuth,
    login,
  };
}
