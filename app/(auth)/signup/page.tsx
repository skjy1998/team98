"use client";

import SignupForm from "@/components/auth/SignupForm";
import ContentState from "@/components/common/ContentState";
import PageHeader from "@/components/PageHeader";
import { useSignup } from "@/hooks/auth/useSignup";

export default function SignupPage() {
  const { errorMessage, successMessage, isCheckingAuth, signup } = useSignup();

  if (isCheckingAuth) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader
          title="회원가입"
          description="이메일 계정을 만들고 팀 관리 서비스를 시작하세요."
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
        title="회원가입"
        description="이메일 계정을 만들고 팀 관리 서비스를 시작하세요."
      />
      <SignupForm
        errorMessage={errorMessage}
        successMessage={successMessage}
        onSubmit={signup}
      />
    </div>
  );
}
