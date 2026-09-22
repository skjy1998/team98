import type { FineRule } from "@/types/finance";
import { Trash2 } from "lucide-react";

interface FinanceFineRuleListProps {
  canManage: boolean;
  isSubmitting: boolean;
  fineRules: FineRule[];
  fineTriggerLabel: Record<string, string>;
  onDeleteFineRule: (ruleId: string) => Promise<void>;
}

export default function FinanceFineRuleList({
  canManage,
  isSubmitting,
  fineRules,
  fineTriggerLabel,
  onDeleteFineRule,
}: Readonly<FinanceFineRuleListProps>) {
  if (fineRules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-stone-400">
        등록된 벌금 규칙이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {fineRules.map((rule) => (
        <div
          key={rule.id}
          className="rounded-xl border border-stone-200 bg-white px-3.5 py-3 shadow-sm sm:px-5 sm:py-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="truncate text-sm font-semibold text-stone-900 sm:text-base">
                {rule.name}{" "}
                <span className="text-xs font-medium text-stone-400 sm:text-sm">
                  ({fineTriggerLabel[rule.trigger]})
                </span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <p className="text-lg font-semibold text-rose-500 sm:text-2xl">
                {rule.amount.toLocaleString()}원
              </p>
              {canManage && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onDeleteFineRule(rule.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`${rule.name} 벌금 규칙 삭제`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
