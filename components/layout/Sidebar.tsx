"use client";

import { usePathname } from "next/navigation";

import NotificationBell from "../notifications/NotificationBell";
import { useSidebarData } from "@/hooks/layout/useSidebarData";

import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const pathname = usePathname();

  const { user, team, sidebarLoaded, sidebarError, logout, reloadSidebarData } =
    useSidebarData();

  return (
    <aside className="hidden self-start lg:block">
      <div className="sticky top-4 z-40 flex flex-col rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
              SquadFlow
            </p>

            <NotificationBell align="left" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-stone-900">
                {!sidebarLoaded
                  ? "팀 정보를 불러오는 중..."
                  : team?.name || "팀 정보 없음"}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                선수와 경기 운영을 한곳에서
              </p>
            </div>
            {team?.name && (
              <span className="shrink-0 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {team?.sport === "futsal" ? "풋살" : "축구"}
              </span>
            )}
          </div>
        </div>

        {sidebarError && (
          <div className="mx-3 mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
            <p className="text-xs font-medium leading-5 text-rose-600">
              {sidebarError}
            </p>

            <button
              type="button"
              onClick={() => void reloadSidebarData()}
              className="mt-1 text-xs font-semibold text-rose-600 underline underline-offset-4"
            >
              다시 불러오기
            </button>
          </div>
        )}

        <SidebarNavigation pathname={pathname} />

        <SidebarFooter team={team} user={user} logout={logout} />
      </div>
    </aside>
  );
}
