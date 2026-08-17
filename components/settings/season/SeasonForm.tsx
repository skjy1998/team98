import type { TeamSeasonFormValue } from "@/types/seasons";
import { useId, type SubmitEvent } from "react";

interface SeasonFormProps {
  value: TeamSeasonFormValue;
  isSaving: boolean;
  submitLabel: string;
  onChange: (value: TeamSeasonFormValue) => void;
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function SeasonForm({
  value,
  isSaving,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: Readonly<SeasonFormProps>) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const startDateId = `${formId}-start-date`;
  const endDateId = `${formId}-end-date`;

  const hasInvalidDateRange = Boolean(
    value.startDate && value.endDate && value.endDate < value.startDate,
  );

  const canSubmit = Boolean(
    value.name.trim() && value.startDate && !hasInvalidDateRange && !isSaving,
  );

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset disabled={isSaving} className="space-y-5">
        <div>
          <label
            htmlFor={nameId}
            className="mb-2 block text-sm font-semibold text-stone-600"
          >
            시즌 이름
          </label>
          <input
            id={nameId}
            value={value.name}
            maxLength={50}
            onChange={(event) =>
              onChange({
                ...value,
                name: event.target.value,
              })
            }
            placeholder="예: 2026 시즌"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
          <p className="mt-1 text-right text-xs text-stone-400">
            {value.name.length}/50
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor={startDateId}
              className="mb-2 block text-sm font-semibold text-stone-600"
            >
              시작일
            </label>
            <input
              id={startDateId}
              type="date"
              value={value.startDate}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: event.target.value,
                })
              }
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
          </div>

          <div>
            <label
              htmlFor={endDateId}
              className="mb-2 flex items-center gap-1 text-sm font-semibold text-stone-600"
            >
              <span>종료일</span>
              <span className="font-normal text-stone-400">선택</span>
            </label>
            <input
              id={endDateId}
              type="date"
              min={value.startDate || undefined}
              value={value.endDate ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  endDate: event.target.value || undefined,
                })
              }
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
            />
          </div>
        </div>

        {hasInvalidDateRange && (
          <p className="text-sm font-medium text-rose-500">
            종료일은 시작일보다 빠를 수 없어요.
          </p>
        )}
      </fieldset>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="h-11 rounded-xl border border-stone-200 px-4 text-sm font-medium text-stone-500 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSaving ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
