"use client";

import { supabase } from "@/lib/supabase";
import {
  BadgeDollarSign,
  CalendarDays,
  ChevronRight,
  Copy,
  Home,
  LogOut,
  MessagesSquare,
  Settings,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationBell from "../notifications/NotificationBell";

type MenuItem = {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type SidebarUser = {
  name: string;
  email: string;
};

type SidebarTeam = {
  name: string;
  sport: "soccer" | "futsal" | "";
  inviteCode: string;
};

const menuSections: MenuSection[] = [
  {
    title: "홈",
    items: [
      {
        label: "대시보드",
        description: "팀 현황 한눈에 보기",
        href: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "운영",
    items: [
      {
        label: "선수 관리",
        description: "멤버와 출전 자원",
        href: "/players",
        icon: Users,
      },
      {
        label: "경기 일정",
        description: "일정과 투표 관리",
        href: "/matches",
        icon: CalendarDays,
      },
      {
        label: "전술 보드",
        description: "포메이션과 역할 배치",
        href: "/tactics",
        icon: Swords,
      },
      {
        label: "기록 통계",
        description: "시즌 기록과 랭킹",
        href: "/stats",
        icon: Trophy,
      },
      {
        label: "회비 관리",
        description: "거래 내역 및 납부",
        href: "/finance",
        icon: BadgeDollarSign,
      },
      {
        label: "팀 게시판",
        description: "공지와 팀 이야기",
        href: "/board",
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: "관리",
    items: [
      {
        label: "설정",
        description: "계정과 팀 환경 관리",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const [user, setUser] = useState<SidebarUser>({
    name: "",
    email: "",
  });

  const [team, setTeam] = useState<SidebarTeam>({
    name: "",
    sport: "",
    inviteCode: "",
  });

  useEffect(() => {
    async function loadSidebarData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      setUser({
        name:
          typeof currentUser.user_metadata?.name === "string" &&
          currentUser.user_metadata.name.trim()
            ? currentUser.user_metadata.name
            : (currentUser.email?.split("@")[0] ?? "사용자"),
        email: currentUser.email ?? "",
      });

      const { data: membership } = await supabase
        .from("team_members")
        .select("teams(name, sport, invite_code)")
        .eq("user_id", currentUser.id)
        .limit(1)
        .maybeSingle();

      const teamData = Array.isArray(membership?.teams)
        ? membership.teams[0]
        : membership?.teams;

      if (!teamData) return;

      setTeam({
        name: teamData.name ?? "",
        sport: teamData.sport ?? "",
        inviteCode: teamData.invite_code ?? "",
      });
    }
    loadSidebarData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCopyInviteCode = async () => {
    if (!team.inviteCode) return;

    await navigator.clipboard.writeText(team.inviteCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const userInitial = user.name ? user.name.slice(0, 1) : "?";

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
                {team.name || "팀 정보를 불러오는 중..."}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                선수와 경기 운영을 한곳에서
              </p>
            </div>
            {team.name && (
              <span className="shrink-0 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {team.sport === "futsal" ? "풋살" : "축구"}
              </span>
            )}
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {menuSections.map((section, index) => (
            <section key={section.title}>
              {index === 0 ? null : (
                <div className="mt-4 border-t border-stone-200/70 pt-4" />
              )}
              <p className="mb-3 px-2 text-[11px] font-semibold tracking-wide text-stone-400">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                        isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-stone-700 hover:bg-stone-50",
                      ].join(" ")}
                    >
                      {isActive && (
                        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-emerald-500" />
                      )}
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "text-stone-400 group-hover:bg-white group-hover:text-stone-700",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.label}
                        </p>
                        <p
                          className={[
                            "mt-0.5 truncate text-[11px]",
                            isActive ? "text-emerald-600" : "text-stone-400",
                          ].join(" ")}
                        >
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
        <div className="border-t border-stone-200 bg-stone-50/60 p-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Team invite
              </p>
              <p className="mt-0.5 truncate font-mono text-xs font-semibold tracking-wider text-stone-700">
                {team.inviteCode || "초대 코드 없음"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyInviteCode}
              disabled={!team.inviteCode}
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
                {user.name || "사용자"}
              </p>
              <p className="truncate text-[11px] text-stone-400">
                {user.email || "이메일 없음"}
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
      </div>
    </aside>
  );
}
