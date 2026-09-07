import {
  hasTeamMembership,
  signInCurrentUser,
} from "@/lib/auth/auth-repository";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGuestAuthGuard } from "./useGuestAuthGuard";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const { isCheckingAuth, authCheckError } = useGuestAuthGuard();

  const [errorMessage, setErrorMessage] = useState("");

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
    errorMessage: authCheckError || errorMessage,
    isCheckingAuth,
    login,
  };
}
