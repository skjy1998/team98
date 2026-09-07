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
import type { ComponentType } from "react";

interface MenuItem {
  label: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarNavigationProps {
  pathname: string;
}

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

export default function SidebarNavigation({
  pathname,
}: Readonly<SidebarNavigationProps>) {
  return (
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
                pathname === item.href || pathname.startsWith(`${item.href}/`);

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
  );
}
