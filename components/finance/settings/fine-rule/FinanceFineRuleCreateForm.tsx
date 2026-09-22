import type { FineRule } from "@/types/finance";
import { ChevronDown } from "lucide-react";

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
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3.5 shadow-sm sm:px-5 sm:py-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <div className="col-span-2 md:col-span-1">
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            규칙 이름
          </p>
          <input
            value={fineRuleName}
            disabled={isSubmitting}
            onChange={(event) => onChangeFineRuleName(event.target.value)}
            placeholder="예: 지각비"
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:text-base"
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            트리거
          </p>
          <div className="relative">
            <select
              value={fineRuleTrigger}
              disabled={isSubmitting}
              onChange={(event) =>
                onChangeFineRuleTrigger(
                  event.target.value as FineRule["trigger"],
                )
              }
              className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-white px-3 pr-10 text-sm text-stone-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:pr-11 sm:text-base"
            >
              <option value="late">지각</option>
              <option value="absence">무단 결석</option>
              <option value="noshow">미투표</option>
              <option value="etc">기타</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:right-4"
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
            금액
          </p>
          <input
            type="number"
            disabled={isSubmitting}
            value={fineRuleAmount}
            onChange={(event) =>
              onChangeFineRuleAmount(Number(event.target.value) || 0)
            }
            placeholder="5000"
            className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4 sm:text-base"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:justify-end sm:gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3 sm:text-base"
        >
          취소
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSave}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-stone-300 sm:px-5 sm:py-3 sm:text-base"
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
