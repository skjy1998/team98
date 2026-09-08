"use client";

import LoginForm from "@/components/auth/LoginForm";
import ContentState from "@/components/common/ContentState";
import { useLogin } from "@/hooks/auth/useLogin";
import AuthPageShell from "./AuthPageShell";

export default function LoginPageClient() {
  const { errorMessage, isCheckingAuth, login } = useLogin();

  return (
    <AuthPageShell
      eyebrow="다시 만나서 반가워요"
      title="로그인"
      description="이메일과 비밀번호를 입력하고 우리 팀 운영을 이어가세요."
    >
      {isCheckingAuth ? (
        <ContentState
          variant="loading"
          title="로그인 상태를 확인하는 중..."
          description="잠시만 기다려 주세요."
        />
      ) : (
        <LoginForm errorMessage={errorMessage} onSubmit={login} />
      )}
    </AuthPageShell>
  );
}
