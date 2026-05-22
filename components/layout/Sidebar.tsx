"use client";

import {
  CalendarDays,
  ChevronRight,
  Home,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden self-start lg:block">
      {/* 사이드바 전체 */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        {/* 팀 박스 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
              F
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              FC 98
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              축구
            </span>
          </div>
        </div>
        <div className="mt-5 border-t border-border/40 pt-5" />
        <nav className="space-y-1">
          {menuSections.map((section, index) => (
            <section key={section.title}>
              {index === 0 ? null : (
                <div className="mt-4 border-t border-border/30 pt-4" />
              )}
              <p className="mb-3 px-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center justify-between rounded-2xl px-3 py-3 transition-colors",
                        isActive
                          ? "border border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            isActive
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
                              : "bg-muted text-muted-foreground",
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
                              isActive
                                ? "text-orange-500 dark:text-orange-400"
                                : "text-muted-foreground",
                            ].join(" ")}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
              <span className="text-base font-extrabold text-muted-foreground">
                송
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                송기준
              </p>
              <p className="truncate text-xs text-muted-foreground">회원</p>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background"
              aria-label="프로필 이동"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
