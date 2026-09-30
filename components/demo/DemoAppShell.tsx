"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  Eye,
  Home,
  LogIn,
  MessagesSquare,
  Settings,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface DemoMenuItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const demoNavigation: Array<{
  title: string;
  items: DemoMenuItem[];
}> = [
  {
    title: "홈",
    items: [
      {
        label: "대시보드",
        description: "팀 현황 한눈에 보기",
        href: "/demo/dashboard",
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
        href: "/demo/players",
        icon: Users,
      },
      {
        label: "경기 일정",
        description: "일정과 투표 관리",
        href: "/demo/matches",
        icon: CalendarDays,
      },
      {
        label: "전술 보드",
        description: "포메이션과 역할 배치",
        href: "/demo/tactics",
        icon: Swords,
      },
      {
        label: "기록 통계",
        description: "시즌 기록과 랭킹",
        href: "/demo/stats",
        icon: Trophy,
      },
      {
        label: "회비 관리",
        description: "거래 내역 및 납부",
        href: "/demo/finance",
        icon: BadgeDollarSign,
      },
      {
        label: "팀 게시판",
        description: "공지와 팀 이야기",
        href: "/demo/board",
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
        href: "/demo/settings",
        icon: Settings,
      },
    ],
  },
];

export default function DemoAppShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 lg:grid lg:grid-cols-[260px_1fr] lg:gap-4 lg:px-3">
        <aside className="hidden self-start lg:block">
          <div className="sticky top-4 flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                  SquadFlow
                </p>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                  DEMO
                </span>
              </div>

              <div className="mt-3">
                <p className="text-lg font-bold text-stone-900">스쿼드FC</p>
                <p className="mt-1 text-xs font-medium text-stone-500">
                  체험형 데모 · 새로고침 시 초기화
                </p>
              </div>
            </div>

            <nav className="space-y-1 p-3" aria-label="데모 메뉴">
              {demoNavigation.map((section, index) => (
                <section key={section.title}>
                  {index > 0 && (
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
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "text-stone-400 group-hover:bg-white group-hover:text-stone-700",
                            ].join(" ")}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold">
                              {item.label}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-stone-400">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </nav>

            <div className="border-t border-stone-100 p-3">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                <LogIn className="h-4 w-4" />내 팀 시작하기
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="mb-4 rounded-2xl border border-stone-200 bg-white shadow-sm lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="font-black tracking-tight text-stone-900"
              >
                SquadFlow
              </Link>

              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                <Eye className="h-3.5 w-3.5" />
                데모
              </span>
            </div>

            <nav
              aria-label="모바일 데모 메뉴"
              className="flex gap-1 overflow-x-auto border-t border-stone-100 px-2 py-2"
            >
              {demoNavigation
                .flatMap((section) => section.items)
                .map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold",
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-stone-500",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
          </header>

          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800 sm:text-sm">
            직접 조작해 볼 수 있는 데모입니다. 변경 내용은 새로고침하면
            초기화됩니다.
          </div>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
