"use client";

import SignupForm from "@/components/auth/SignupForm";
import ContentState from "@/components/common/ContentState";
import { useSignup } from "@/hooks/auth/useSignup";
import AuthPageShell from "./AuthPageShell";

export default function SignupPageClient() {
  const { errorMessage, successMessage, isCheckingAuth, signup } = useSignup();

  return (
    <AuthPageShell
      eyebrow="새로운 팀 운영의 시작"
      title="회원가입"
      description="계정을 만들고 우리 팀의 일정과 기록을 관리해보세요."
    >
      {isCheckingAuth ? (
        <ContentState
          variant="loading"
          title="로그인 상태를 확인하는 중..."
          description="잠시만 기다려 주세요."
        />
      ) : (
        <SignupForm
          errorMessage={errorMessage}
          successMessage={successMessage}
          onSubmit={signup}
        />
      )}
    </AuthPageShell>
  );
}
