import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  HandCoins,
  Users,
} from "lucide-react";
import DashboardQuickLinkButton from "./DashboardQuickLinkButton";
import type { DashboardQuickLink } from "@/types/dashboard";

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
        {quickLinks.map((link) => (
          <DashboardQuickLinkButton
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            iconClassName={link.iconClassName}
          />
        ))}
      </div>
    </section>
  );
}
