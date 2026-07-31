import { formatFinanceEntryDescription } from "@/lib/finance/finance";
import type { FineCharge } from "@/types/finance";
import { useState } from "react";

interface FinanceFineChargeItemProps {
  charge: FineCharge;
  canManage: boolean;
  onDelete: (fineChargeId: string) => Promise<boolean>;
  onChangeStatus: (
    charge: FineCharge,
    nextStatus: FineCharge["status"],
  ) => Promise<boolean>;
}

export default function FinanceFineChargeItem({
  charge,
  canManage,
  onDelete,
  onChangeStatus,
}: Readonly<FinanceFineChargeItemProps>) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChangeStatus = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const nextStatus = charge.status === "paid" ? "unpaid" : "paid";
      const success = await onChangeStatus(charge, nextStatus);

      if (!success) {
        globalThis.alert("벌금 납부 상태 변경에 실패했어요.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;

    const confirmed = globalThis.confirm("이 벌금 부과 내역을 삭제할까요?");

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const success = await onDelete(charge.id);

      if (!success) {
        globalThis.alert("벌금 삭제에 실패했어요.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-stone-900">
          {formatFinanceEntryDescription(charge.description)}
        </p>
        <p className="mt-1 text-sm text-stone-500">
          {new Date(charge.chargedAt).toLocaleDateString("ko-KR")}
        </p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-base font-semibold ${
              charge.status === "paid" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {charge.amount.toLocaleString()}원
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {charge.status === "paid" ? "납부 완료" : "미납 벌금"}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={handleChangeStatus}
            disabled={isProcessing}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              charge.status === "paid"
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isProcessing
              ? "처리 중..."
              : charge.status === "paid"
                ? "미납으로 변경"
                : "납부 완료"}
          </button>
        )}

        {canManage && charge.status === "unpaid" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessing}
            className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
