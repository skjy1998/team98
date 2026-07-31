import type { FineRule } from "@/types/finance";

interface FinanceFineRuleCreateFormProps {
  fineRuleName: string;
  isSubmitting: boolean;
  onChangeFineRuleName: (value: string) => void;
  fineRuleTrigger: FineRule["trigger"];
  onChangeFineRuleTrigger: (value: FineRule["trigger"]) => void;
  fineRuleAmount: number;
  onChangeFineRuleAmount: (value: number) => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
}

export default function FinanceFineRuleCreateForm({
  fineRuleName,
  isSubmitting,
  onChangeFineRuleName,
  fineRuleTrigger,
  onChangeFineRuleTrigger,
  fineRuleAmount,
  onChangeFineRuleAmount,
  onCancel,
  onSave,
}: Readonly<FinanceFineRuleCreateFormProps>) {
  return (
    <div className="rounded-xl border border-orange-200 bg-white px-5 py-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">규칙 이름</p>
          <input
            value={fineRuleName}
            disabled={isSubmitting}
            onChange={(event) => onChangeFineRuleName(event.target.value)}
            placeholder="예: 지각비"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">트리거</p>
          <select
            value={fineRuleTrigger}
            disabled={isSubmitting}
            onChange={(event) =>
              onChangeFineRuleTrigger(event.target.value as FineRule["trigger"])
            }
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          >
            <option value="late">지각</option>
            <option value="absence">무단 결석</option>
            <option value="noshow">미투표</option>
            <option value="etc">기타</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">금액</p>
          <input
            type="number"
            disabled={isSubmitting}
            value={fineRuleAmount}
            onChange={(event) =>
              onChangeFineRuleAmount(Number(event.target.value) || 0)
            }
            placeholder="5000"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-xl px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSave}
          className="rounded-xl bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
