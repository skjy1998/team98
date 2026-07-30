import type { ReactNode } from "react";

interface MatchInfoFieldCardProps {
  label: string;
  children: ReactNode;
}

export default function MatchInfoFieldCard({
  label,
  children,
}: Readonly<MatchInfoFieldCardProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
      <p className="text-sm text-stone-400">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
