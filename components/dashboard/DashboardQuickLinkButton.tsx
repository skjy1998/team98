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
      className="flex h-12 items-center justify-between rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 sm:h-16 sm:px-4 sm:text-sm"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl",
            iconClassName,
          ].join(" ")}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span>{label}</span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-400 sm:h-4 sm:w-4" />
    </Link>
  );
}
