"use client";

import { usePasswordRecoverySession } from "@/hooks/auth/usePasswordRecoverySession";
import { usePasswordUpdate } from "@/hooks/auth/usePasswordUpdate";
import AuthPageShell from "./AuthPageShell";
import ContentState from "@/components/common/ContentState";
import Link from "next/link";
import PasswordUpdateForm from "./PasswordUpdateForm";

export default function PasswordUpdatePageClient() {
  const recoveryStatus = usePasswordRecoverySession();
  const { errorMessage, successMessage, updatePassword } = usePasswordUpdate();

  return (
    <AuthPageShell
      eyebrow="계정 복구"
      title="새 비밀번호 설정"
      description="앞으로 로그인할 때 사용할 새로운 비밀번호를 입력해 주세요."
    >
      {recoveryStatus === "checking" && (
        <ContentState
          variant="loading"
          title="재설정 링크를 확인하는 중..."
          description="잠시만 기다려 주세요."
        />
      )}

      {recoveryStatus === "invalid" && (
        <ContentState
          variant="error"
          title="재설정 링크를 사용할 수 없어요."
          description="링크가 만료됐거나 올바르지 않습니다. 새로운 링크를 요청해 주세요."
          action={
            <Link
              href="/forgot-password"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white transition hover:bg-emerald-700 sm:px-4 sm:text-sm"
            >
              재설정 링크 다시받기
            </Link>
          }
        />
      )}

      {recoveryStatus === "valid" && (
        <PasswordUpdateForm
          errorMessage={errorMessage}
          successMessage={successMessage}
          onSubmit={updatePassword}
        />
      )}
    </AuthPageShell>
  );
}
