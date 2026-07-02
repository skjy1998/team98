import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  HandCoins,
  LucideIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

interface DashboardQuickLink {
  href: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const quickLinks: DashboardQuickLink[] = [
  {
    href: "/players",
    label: "선수 관리",
    icon: Users,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    href: "/matches",
    label: "경기 일정",
    icon: CalendarDays,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    href: "/tactics",
    label: "전술 보드",
    icon: ClipboardList,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    href: "/stats",
    label: "기록 통계",
    icon: BarChart3,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    href: "/finance",
    label: "회비 관리",
    icon: HandCoins,
    iconClassName: "bg-rose-50 text-rose-600",
  },
];

export default function DashboardQuickLinkSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">빠른 이동</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {quickLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-16 items-center justify-between rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    link.iconClassName,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{link.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
