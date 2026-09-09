"use client";

import { usePasswordResetRequest } from "@/hooks/auth/usePasswordResetRequest";
import AuthPageShell from "./AuthPageShell";
import PasswordResetRequestForm from "./PasswordResetRequestForm";

export default function PasswordResetRequestPageClient() {
  const { errorMessage, successMessage, sendResetEmail } =
    usePasswordResetRequest();

  return (
    <AuthPageShell
      eyebrow="계정 복구"
      title="비밀번호 찾기"
      description="가입한 이메일을 입력하면 비밀번호를 다시 설정할 수 있는 링크를 보내드려요."
    >
      <PasswordResetRequestForm
        errorMessage={errorMessage}
        successMessage={successMessage}
        onSubmit={sendResetEmail}
      />
    </AuthPageShell>
  );
}
