import type { FineRule } from "@/types/finance";

interface FinanceFineRuleListProps {
  fineRules: FineRule[];
  fineTriggerLabel: Record<string, string>;
  onDeleteFineRule: (ruleId: string) => void;
}

export default function FinanceFineRuleList({
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
    <div className="space-y-3">
      {fineRules.map((rule) => (
        <div
          key={rule.id}
          className="rounded-xl border border-stone-200 bg-white px-5 py-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-stone-900">
                {rule.name}{" "}
                <span className="text-stone-400">
                  ({fineTriggerLabel[rule.trigger]})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-semibold text-rose-500">
                {rule.amount.toLocaleString()}원
              </p>
              <button
                type="button"
                onClick={() => onDeleteFineRule(rule.id)}
                className="text-xl text-rose-400 transition hover:text-rose-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
