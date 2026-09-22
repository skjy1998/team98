import { formatFinanceEntryDescription } from "@/lib/finance/finance-fine";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { FineCharge } from "@/types/finance";
import type { MatchItem } from "@/types/match";
import { AlarmClock, CircleAlert, Package, Trash2 } from "lucide-react";
import { useState } from "react";

interface FinanceFineChargeItemProps {
  charge: FineCharge;
  matches: MatchItem[];
  canManage: boolean;
  onDelete: (fineChargeId: string) => Promise<boolean>;
  onChangeStatus: (
    charge: FineCharge,
    nextStatus: FineCharge["status"],
  ) => Promise<boolean>;
}

function getFineChargeSummary(description: string) {
  const normalized = formatFinanceEntryDescription(description);
  const playerName = normalized.match(/\(([^)]+)\)\s*$/)?.[1];
  const reason = normalized
    .replace(/^\d{4}-\d{2}-\d{2}\s+/, "")
    .replace(/\s+\([^)]*\)$/, "")
    .replace(/\s+벌금$/, "");

  return { playerName, reason };
}

export default function FinanceFineChargeItem({
  charge,
  matches,
  canManage,
  onDelete,
  onChangeStatus,
}: Readonly<FinanceFineChargeItemProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [isProcessing, setIsProcessing] = useState(false);

  const relatedMatch = charge.matchId
    ? matches.find((match) => match.id === charge.matchId)
    : undefined;

  const { playerName, reason } = getFineChargeSummary(charge.description);

  const detailLabel = relatedMatch
    ? relatedMatch.type === "자체전"
      ? `${relatedMatch.date} · 자체전`
      : `${relatedMatch.date} vs ${relatedMatch.opponent ?? relatedMatch.title}`
    : new Date(charge.chargedAt).toLocaleDateString("ko-KR");

  const FineIcon =
    charge.trigger === "late"
      ? AlarmClock
      : charge.trigger === "noshow"
        ? Package
        : CircleAlert;

  const fineIconClassName =
    charge.trigger === "late" || charge.trigger === "absence"
      ? "bg-rose-50 text-rose-500"
      : charge.trigger === "noshow"
        ? "bg-sky-50 text-sky-600"
        : "bg-amber-50 text-amber-600";

  const handleChangeStatus = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const nextStatus = charge.status === "paid" ? "unpaid" : "paid";
      const success = await onChangeStatus(charge, nextStatus);

      if (!success) {
        showToast("벌금 납부 상태 변경에 실패했어요.", "error");
        return;
      }

      showToast(
        nextStatus === "paid"
          ? "벌금을 납부 완료 처리했어요."
          : "벌금을 미납 상태로 변경했어요.",
        "success",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (isProcessing) return;

    const confirmed = await confirm({
      title: "벌금 내역 삭제",
      description:
        "이 벌금 부과 내역을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const success = await onDelete(charge.id);

      if (!success) {
        showToast("벌금 삭제에 실패했어요.", "error");
        return;
      }

      showToast("벌금 부과 내역을 삭제했어요.", "success");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-3.5 py-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${fineIconClassName}`}
        >
          <FineIcon aria-hidden="true" className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900 sm:text-base">
            {playerName ? (
              <>
                {playerName}
                <span className="text-xs font-medium text-stone-400 sm:text-sm">
                  {" "}
                  · {reason}
                </span>
              </>
            ) : (
              reason
            )}
          </p>
          <p className="mt-0.5 truncate text-xs text-stone-500 sm:mt-1 sm:text-sm">
            {detailLabel}
          </p>
        </div>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-4 sm:gap-3">
        <div className="text-right">
          <p
            className={`text-sm font-semibold sm:text-base ${
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
            className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm ${
              charge.status === "paid"
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isProcessing ? (
              "처리 중..."
            ) : charge.status === "paid" ? (
              <>
                <span className="sm:hidden">미납</span>
                <span className="hidden sm:inline">미납으로 변경</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">완료</span>
                <span className="hidden sm:inline">납부 완료</span>
              </>
            )}
          </button>
        )}

        {canManage && charge.status === "unpaid" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessing}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="벌금 내역 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
