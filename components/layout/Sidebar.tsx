"use client";

import { supabase } from "@/lib/supabase";
import {
  BadgeDollarSign,
  CalendarDays,
  ChevronRight,
  Home,
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
      <div className="rounded-xl border border-stone-200 bg-[#fcfbf8] p-5 shadow-sm">
        <div className="relative rounded-2xl border border-stone-200 bg-white/80 p-3">
          <div className="flex items-center gap-3 pr-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
              <span className="text-base font-extrabold text-stone-500">
                {userInitial}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-900">
                {user.name || "사용자"}
              </p>
              <p className="truncate text-xs text-stone-400">
                {user.email || "이메일 없음"}
              </p>
            </div>
          </div>

          <div className="absolute right-3 top-3">
            <NotificationBell align="left" />
          </div>
        </div>
        <div className="mt-5 border-t border-stone-200/80 pt-5" />
        <div className="mb-4 rounded-xl border border-stone-200 bg-white/80 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
            SquadFlow
          </p>

          {team.name ? (
            <div className="mt-2 flex items-center gap-2">
              <p className="truncate text-lg font-semibold text-stone-900">
                {team.name}
              </p>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  team.sport === "futsal"
                    ? "bg-sky-50 text-sky-600"
                    : "bg-emerald-50 text-emerald-600",
                ].join(" ")}
              >
                {team.sport === "futsal" ? "풋살" : "축구"}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-400">
              팀 정보를 불러오는 중...
            </p>
          )}
        </div>
        <div className="mt-5 border-t border-stone-200/80 pt-5" />
        <nav className="space-y-1">
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
                        "flex items-center justify-between rounded-2xl px-3 py-3 transition-colors",
                        isActive
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "text-stone-700 hover:bg-white",
                      ].join(" ")}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-stone-100 text-stone-500",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {item.label}
                          </p>
                          <p
                            className={[
                              "truncate text-xs",
                              isActive ? "text-emerald-700" : "text-stone-400",
                            ].join(" ")}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
        <div className="mt-6 border-t border-stone-200 pt-4">
          <div className="rounded-xl border border-stone-200 bg-white/80 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-stone-400">
              초대코드
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-900">
              {team.inviteCode || "초대코드 없음"}
            </p>

            <button
              type="button"
              onClick={handleCopyInviteCode}
              disabled={!team.inviteCode}
              className={[
                "mt-3 flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition",
                team.inviteCode
                  ? "border-stone-200 text-stone-600 hover:bg-stone-50"
                  : "cursor-not-allowed border-stone-100 text-stone-300",
              ].join(" ")}
            >
              {isCopied ? "복사됨!" : "초대코드 복사"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}
