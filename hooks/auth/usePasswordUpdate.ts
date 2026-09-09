import {
  signOutCurrentUser,
  updateCurrentUserPassword,
} from "@/lib/auth/auth-repository";
import type { PasswordUpdateFormValues } from "@/lib/auth/auth-schema";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function usePasswordUpdate() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updatePassword = async ({ password }: PasswordUpdateFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateCurrentUserPassword(password);
      await signOutCurrentUser();
      setSuccessMessage(
        "비밀번호가 변경됐어요. 새 비밀번호로 로그인해 주세요.",
      );

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1200);
      });

      router.replace("/login");
    } catch (error) {
      console.error("password update error", error);
      setErrorMessage(
        getAuthErrorMessage(error, "비밀번호 변경에 실패했어요."),
      );
    }
  };

  return {
    errorMessage,
    successMessage,
    updatePassword,
  };
}
