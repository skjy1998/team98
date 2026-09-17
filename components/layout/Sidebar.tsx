"use client";

import { usePathname } from "next/navigation";
import NotificationBell from "../notifications/NotificationBell";
import { useSidebarData } from "@/hooks/layout/useSidebarData";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import SidebarTeamSwitcher from "./SidebarTeamSwitcher";
import type { PlayerRole, TeamMemberRole } from "@/types/player";

function getSidebarRoleLabel(
  memberRole: TeamMemberRole | null,
  playerRole: PlayerRole | null,
) {
  if (memberRole === "owner") return "회장";
  if (memberRole === "staff") return "운영진";
  if (playerRole === "captain") return "주장";
  if (playerRole === "viceCaptain") return "부주장";

  return "일반 회원";
}

export default function Sidebar() {
  const pathname = usePathname();

  const {
    user,
    team,
    memberRole,
    playerRole,
    sidebarError,
    logout,
    reloadSidebarData,
  } = useSidebarData();

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
              <SidebarTeamSwitcher />

              <p className="mt-1 text-xs font-medium text-stone-500">
                {getSidebarRoleLabel(memberRole, playerRole)} ·{" "}
                {user?.name ?? "사용자"}
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
