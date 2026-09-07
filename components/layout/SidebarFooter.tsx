import type { CurrentUserSummary } from "@/lib/auth/auth-repository";
import type { CurrentTeam } from "@/types/team";
import { useToastStore } from "@/stores/toast-store";
import { Copy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarFooterProps {
  team: CurrentTeam | null;
  user: CurrentUserSummary | null;
  logout: () => Promise<boolean>;
}

export default function SidebarFooter({
  team,
  user,
  logout,
}: Readonly<SidebarFooterProps>) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const [isCopied, setIsCopied] = useState(false);

  const handleLogout = async () => {
    const success = await logout();

    if (!success) {
      showToast("로그아웃에 실패했어요.", "error");
      return;
    }

    router.replace("/login");
  };

  const handleCopyInviteCode = async () => {
    const inviteCode = team?.inviteCode;

    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      console.error("invite code copy error", error);
      showToast("초대 코드 복사에 실패했어요.", "error");
    }
  };

  const userInitial = user?.name.slice(0, 1) || "?";

  return (
    <div className="border-t border-stone-200 bg-stone-50/60 p-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            Team Invite
          </p>
          <p className="mt-0.5 truncate font-mono text-xs font-semibold tracking-wider text-stone-700">
            {team?.inviteCode || "초대 코드 없음"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyInviteCode}
          disabled={!team?.inviteCode}
          aria-label="초대 코드 복사"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {isCopied && (
        <p className="mt-2 px-1 text-xs font-medium text-emerald-600">
          초대 코드를 복사했어요.
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-bold text-stone-600">
          {userInitial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-stone-900">
            {user?.name || "사용자"}
          </p>
          <p className="truncate text-[11px] text-stone-400">
            {user?.email || "이메일 없음"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="로그아웃"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
