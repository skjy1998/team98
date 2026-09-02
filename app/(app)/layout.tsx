"use client";

import ContentState from "@/components/common/ContentState";
import AppShell from "@/components/layout/AppShell";
import { CurrentTeamProvider } from "@/components/providers/CurrentTeamProvider";
import { useAppAccess } from "@/hooks/auth/useAppAccess";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isCheckingAccess, accessErrorMessage } = useAppAccess();

  if (isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-xl">
          <ContentState
            variant="loading"
            title="팀 접근 권한을 확인하는 중..."
            description="로그인과 팀 가입 정보를 확인하고 있어요."
          />
        </div>
      </main>
    );
  }

  if (accessErrorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-xl">
          <ContentState
            variant="error"
            title={accessErrorMessage}
            description="잠시 후 페이지를 새로고침해 주세요."
          />
        </div>
      </main>
    );
  }

  return (
    <CurrentTeamProvider>
      <AppShell>{children}</AppShell>
    </CurrentTeamProvider>
  );
}
