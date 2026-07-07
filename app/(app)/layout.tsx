"use client";

import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: membership, error: membershipError } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        setIsCheckingAccess(false);
        return;
      }

      if (!membership) {
        router.replace("/teams/setup");
        return;
      }

      setIsCheckingAccess(false);
    }

    checkAccess();
  }, [router]);

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-xl border border-stone-200 bg-white px-6 py-4 text-sm text-stone-500 shadow-sm">
          팀 접근 권한을 확인하는 중...
        </div>
      </div>
    );
  }
  return <AppShell>{children}</AppShell>;
}
