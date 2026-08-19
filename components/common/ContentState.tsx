import { CircleAlert, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

type ContentStateVariant = "loading" | "empty" | "error";

interface ContentStateProps {
  variant: ContentStateVariant;
  title: string;
  description?: string;
  action?: ReactNode;
}

const stateStyles = {
  loading: {
    container: "border-stone-200 bg-white",
    icon: "bg-stone-100 text-stone-500",
    Icon: LoaderCircle,
  },
  empty: {
    container: "border-dashed border-stone-300 bg-stone-50/60",
    icon: "bg-white text-stone-400",
    Icon: Inbox,
  },
  error: {
    container: "border-rose-200 bg-rose-50/60",
    icon: "bg-white text-rose-500",
    Icon: CircleAlert,
  },
} as const;

export default function ContentState({
  variant,
  title,
  description,
  action,
}: Readonly<ContentStateProps>) {
  const style = stateStyles[variant];
  const Icon = style.Icon;

  return (
    <output
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "block w-full rounded-xl border px-6 py-10 text-center shadow-sm",
        style.container,
      ].join(" ")}
    >
      <span
        className={[
          "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl",
          style.icon,
        ].join(" ")}
      >
        <Icon
          className={[
            "h-6 w-6",
            variant === "loading" ? "animate-spin" : "",
          ].join(" ")}
        />
      </span>

      <span className="mt-4 block text-sm font-semibold text-stone-700">
        {title}
      </span>

      {description && (
        <span className="mt-1 block text-xs leading-5 text-stone-400">
          {description}
        </span>
      )}

      {action && <span className="mt-4 block">{action}</span>}
    </output>
  );
}
