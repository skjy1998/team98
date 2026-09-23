import type { DashboardTodoItem, DashboardTodoType } from "@/types/dashboard";
import {
  CalendarCheck,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

interface DashboardTodoListProps {
  items: DashboardTodoItem[];
}

const todoTypeMap: Record<
  DashboardTodoType,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    iconClassName: string;
  }
> = {
  "match-vote": {
    label: "경기 투표",
    icon: CalendarCheck,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  "fee-unpaid": {
    label: "회비",
    icon: WalletCards,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  "fine-unpaid": {
    label: "벌금",
    icon: CircleDollarSign,
    iconClassName: "bg-rose-50 text-rose-600",
  },
  management: {
    label: "팀 운영",
    icon: ClipboardCheck,
    iconClassName: "bg-amber-50 text-amber-600",
  },
};

export default function DashboardTodoList({
  items,
}: Readonly<DashboardTodoListProps>) {
  return (
    <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      {items.map((item) => {
        const typeStyle = todoTypeMap[item.type];
        const Icon = typeStyle.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center gap-3 px-3.5 py-3 transition hover:bg-stone-50 sm:gap-4 sm:px-5 sm:py-4"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeStyle.iconClassName} sm:h-10 sm:w-10 sm:rounded-xl`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-stone-400 sm:text-xs">
                {typeStyle.label}
              </span>

              <p className="mt-1 truncate text-xs font-semibold text-stone-800 sm:text-sm">
                {item.title}
              </p>
              <p className="mt-1 truncate text-[11px] text-stone-400 sm:text-xs">
                {item.description}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500" />
          </Link>
        );
      })}
    </div>
  );
}
