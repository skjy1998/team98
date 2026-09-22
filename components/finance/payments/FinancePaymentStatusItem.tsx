import type { PaymentStatusRow } from "@/types/finance";

interface FinancePaymentStatusItemProps {
  row: PaymentStatusRow;
  canManage: boolean;
  onChangePaymentStatus: (
    playerId: string,
    playerName: string,
    nextStatus: "paid" | "unpaid",
  ) => Promise<boolean>;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export default function FinancePaymentStatusItem({
  row,
  canManage,
  onChangePaymentStatus,
  selectable = false,
  selected = false,
  onToggleSelect,
}: Readonly<FinancePaymentStatusItemProps>) {
  const hasFeeDetails = row.feeAmount !== undefined;

  const feeLabel = hasFeeDetails
    ? `${row.feeTypeName ?? "회비"} · ${row.feeAmount?.toLocaleString()}원`
    : "회비 유형을 먼저 설정해 주세요.";

  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-stone-300 accent-emerald-600"
          />
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900 sm:text-base">
            {row.playerName}
          </p>
          <p
            className={`mt-0.5 truncate text-xs sm:mt-1 sm:text-sm ${
              hasFeeDetails ? "text-stone-500" : "text-amber-600"
            }`}
          >
            {row.status === "paid" && hasFeeDetails
              ? `${feeLabel} · ${row.paidAt}`
              : feeLabel}
          </p>
        </div>
      </div>

      {canManage && !row.isFeeConfigured ? (
        <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-700">
          미설정
        </span>
      ) : canManage ? (
        <>
          <div className="flex shrink-0 rounded-lg border border-stone-200 bg-stone-50 p-0.5 md:hidden">
            {(
              [
                { value: "unpaid", label: "미납" },
                { value: "paid", label: "완료" },
              ] as const
            ).map((option) => {
              const isSelected = row.status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChangePaymentStatus(
                      row.playerId,
                      row.playerName,
                      option.value,
                    )
                  }
                  aria-pressed={isSelected}
                  className={`rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                    isSelected
                      ? option.value === "paid"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-rose-500 text-white shadow-sm"
                      : "text-stone-400"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <select
            value={row.status}
            onChange={(event) =>
              onChangePaymentStatus(
                row.playerId,
                row.playerName,
                event.target.value as "paid" | "unpaid",
              )
            }
            className="hidden min-w-[110px] rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 outline-none focus:border-emerald-300 md:block"
          >
            <option value="unpaid">미납</option>
            <option value="paid">납부 완료</option>
          </select>
        </>
      ) : (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            row.status === "paid"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {row.status === "paid" ? "납부 완료" : "미납"}
        </span>
      )}
    </div>
  );
}
