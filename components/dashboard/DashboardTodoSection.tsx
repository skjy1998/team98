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

interface DashboardTodoSectionProps {
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

export default function DashboardTodoSection({
  items,
}: Readonly<DashboardTodoSectionProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900">내 할 일</span>

        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
          {items.length}개
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 px-5 py-8 text-center">
          <p className="text-sm font-medium text-stone-500">
            지금 처리할 일이 없어요.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            새로운 할 일이 생기면 여기에 표시돼요.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {items.map((item) => {
            const typeStyle = todoTypeMap[item.type];
            const Icon = typeStyle.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeStyle.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-400">
                      {typeStyle.label}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm font-semibold text-stone-800">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-stone-400">
                    {item.description}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-stone-500" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
