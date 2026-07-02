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
      className="flex h-16 items-center justify-between rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            iconClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span>{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
    </Link>
  );
}
