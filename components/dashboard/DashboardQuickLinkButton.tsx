import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardQuickLinkButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

export default function DashboardQuickLinkButton({
  href,
  label,
  icon: Icon,
  iconClassName,
}: Readonly<DashboardQuickLinkButtonProps>) {
  return (
    <Link
      href={href}
      className="flex h-14 items-center justify-between rounded-xl border border-stone-200 bg-white px-3.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 sm:h-16 sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border sm:h-10 sm:w-10",
            iconClassName,
          ].join(" ")}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span>{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
    </Link>
  );
}
