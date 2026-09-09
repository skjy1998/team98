import { requestPasswordReset } from "@/lib/auth/auth-repository";
import type { PasswordResetRequestFormValues } from "@/lib/auth/auth-schema";
import { getAuthErrorMessage } from "@/lib/auth/auth-ui";
import { useState } from "react";

export function usePasswordResetRequest() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const sendResetEmail = async ({ email }: PasswordResetRequestFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await requestPasswordReset(
        email.trim().toLowerCase(),
        `${globalThis.location.origin}/reset-password`,
      );

      setSuccessMessage(
        "비밀번호 재설정 링크를 이메일로 보냈어요. 받은 편지함을 확인해 주세요.",
      );
    } catch (error) {
      console.error("password reset request error", error);
      setErrorMessage(
        getAuthErrorMessage(error, "비밀번호 재설정 이메일 전송에 실패했어요."),
      );
    }
  };

  return {
    errorMessage,
    successMessage,
    sendResetEmail,
  };
}
