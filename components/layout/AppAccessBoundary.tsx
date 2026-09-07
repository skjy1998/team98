"use client";

import { useAppAccess } from "@/hooks/auth/useAppAccess";
import type { ReactNode } from "react";
import ContentState from "../common/ContentState";
import { CurrentTeamProvider } from "../providers/CurrentTeamProvider";
import { NotificationProvider } from "../providers/NotificationProvider";
import AppShell from "./AppShell";

interface AppAccessBoundaryProps {
  children: ReactNode;
}

export default function AppAccessBoundary({
  children,
}: Readonly<AppAccessBoundaryProps>) {
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
      <NotificationProvider>
        <AppShell>{children}</AppShell>
      </NotificationProvider>
    </CurrentTeamProvider>
  );
}
