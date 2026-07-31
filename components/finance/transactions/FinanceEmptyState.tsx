import { FinanceEmptyStateProps } from "@/types/finance-ui";

export default function FinanceEmptyState({
  message,
}: Readonly<FinanceEmptyStateProps>) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  );
}
