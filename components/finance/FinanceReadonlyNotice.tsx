import type { FinanceReadonlyNoticeProps } from "@/types/finance-ui";

export default function FinanceReadonlyNotice({
  message,
}: Readonly<FinanceReadonlyNoticeProps>) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
      {message}
    </div>
  );
}
