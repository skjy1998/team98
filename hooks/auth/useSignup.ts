import {
  hasCurrentSession,
  signOutCurrentUser,
  signUpCurrentUser,
} from "@/lib/auth/auth-repository";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export function useSignup() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
        console.error("signup session check error", error);
        setErrorMessage("로그인 상태를 확인하지 못했어요.");
      }

      setIsCheckingAuth(false);
    }

    void checkSession();
  }, [router]);

  const signup = async ({ name, email, password }: SignupCredentials) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await signUpCurrentUser(
        name.trim(),
        email.trim().toLowerCase(),
        password,
      );
      await signOutCurrentUser();
    } catch (error) {
      console.error("signup error", error);
      setErrorMessage(getAuthErrorMessage(error, "회원가입에 실패했어요."));
      return;
    }

    setSuccessMessage("회원가입이 완료됐어요. 로그인해 주세요.");

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1200);
    });
    router.push("/login");
  };

  return {
    errorMessage,
    successMessage,
    isCheckingAuth,
    signup,
  };
}
