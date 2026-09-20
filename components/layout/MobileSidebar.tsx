import type { CurrentUserSummary } from "@/lib/auth/auth-repository";
import type { CurrentTeam } from "@/types/team";
import { useEffect, useState } from "react";
import NotificationBell from "../notifications/NotificationBell";
import { Menu, X } from "lucide-react";
import SidebarTeamSwitcher from "./SidebarTeamSwitcher";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import { useEscapeKey } from "@/hooks/common/useEscapeKey";

interface MobileSidebarProps {
  pathname: string;
  team: CurrentTeam | null;
  user: CurrentUserSummary | null;
  sidebarError: string;
  logout: () => Promise<boolean>;
  onRetry: () => Promise<void>;
}

export default function MobileSidebar({
  pathname,
  team,
  user,
  sidebarError,
  logout,
  onRetry,
}: Readonly<MobileSidebarProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEscapeKey(closeMenu, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-3 z-30 mb-3 flex h-14 items-center justify-between rounded-2xl border border-stone-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
            SquadFlow
          </p>
          <p className="truncate text-sm font-bold text-stone-900">
            {team?.name ?? "팀 정보 없음"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell align="right" />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="메뉴 열기"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-panel"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:bg-stone-50"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={closeMenu}
            className="absolute inset-0 bg-stone-950/35"
          />

          <aside
            id="mobile-navigation-panel"
            className="relative flex h-full w-[min(20rem,calc(100vw-2rem))] flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-5 py-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                  SquadFlow
                </p>
                <div className="mt-2">
                  <SidebarTeamSwitcher />
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="메뉴 닫기"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-stone-500 transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {sidebarError && (
              <div className="mx-3 mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
                <p className="text-xs font-medium leading-5 text-rose-600">
                  {sidebarError}
                </p>
                <button
                  type="button"
                  onClick={() => void onRetry()}
                  className="mt-1 text-xs font-semibold text-rose-600 underline underline-offset-4"
                >
                  다시 불러오기
                </button>
              </div>
            )}

            <div className="flex-1">
              <SidebarNavigation pathname={pathname} onNavigate={closeMenu} />
            </div>

            <SidebarFooter team={team} user={user} logout={logout} />
          </aside>
        </div>
      )}
    </>
  );
}
