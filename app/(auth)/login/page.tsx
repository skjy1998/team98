"use client";

import LoginForm from "@/components/auth/LoginForm";
import ContentState from "@/components/common/ContentState";
import PageHeader from "@/components/PageHeader";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginPage() {
  const { errorMessage, isCheckingAuth, login } = useLogin();

  if (isCheckingAuth) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader
          title="로그인"
          description="이메일과 비밀번호로 팀 관리 서비스에 로그인하세요."
        />
        <ContentState
          variant="loading"
          title="로그인 상태를 확인하는 중..."
          description="잠시만 기다려 주세요."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="로그인"
        description="이메일과 비밀번호로 팀 관리 서비스에 로그인하세요."
      />

      <LoginForm errorMessage={errorMessage} onSubmit={login} />
    </div>
  );
}
