import { FineRule } from "@/types/finance";

interface FinanceFineRuleCreateFormProps {
  fineRuleName: string;
  onChangeFineRuleName: (value: string) => void;
  fineRuleTrigger: FineRule["trigger"];
  onChangeFineRuleTrigger: (value: FineRule["trigger"]) => void;
  fineRuleAmount: number;
  onChangeFineRuleAmount: (value: number) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function FinanceFineRuleCreateForm({
  fineRuleName,
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
            onChange={(event) => onChangeFineRuleName(event.target.value)}
            placeholder="예: 지각비"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">트리거</p>
          <select
            value={fineRuleTrigger}
            onChange={(event) => onChangeFineRuleTrigger(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none focus:border-orange-300"
          >
            <option value="late">지각</option>
            <option value="absence">무단 결석</option>
            <option value="noshow">미투표</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-stone-500">금액</p>
          <input
            type="number"
            value={fineRuleAmount}
            onChange={(event) =>
              onChangeFineRuleAmount(Number(event.target.value) || 0)
            }
            placeholder="5000"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-3 text-base font-medium text-stone-500 transition hover:bg-stone-100"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
        >
          저장
        </button>
      </div>
    </div>
  );
}
