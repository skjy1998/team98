import { FeeType } from "@/types/finance";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FeeTypePickerProps {
  feeTypes: FeeType[];
  value: string;
  onChange: (value: string) => void;
  id: string;
}

export default function FeeTypePicker({
  feeTypes,
  value,
  onChange,
  id,
}: Readonly<FeeTypePickerProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedFeeType = feeTypes.find((feeType) => feeType.id === value);

  const getLabel = (feeType?: FeeType) =>
    feeType
      ? `${feeType.name} · ${feeType.amount.toLocaleString()}월`
      : "회비 미설정";

  const handleSelect = (feeTypeId: string) => {
    onChange(feeTypeId);
    setIsOpen(false);
  };

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 text-left text-sm text-stone-800 transition hover:border-emerald-300"
        >
          <span className="truncate">{getLabel(selectedFeeType)}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
        </button>
      </div>

      <div className="relative hidden md:block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full appearance-none rounded-[18px] border border-stone-200 bg-white px-4 pr-11 text-base text-stone-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">회비 미설정</option>
          {feeTypes.map((feeType) => (
            <option key={feeType.id} value={feeType.id}>
              {getLabel(feeType)}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="회비 유형 선택 닫기"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/35"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[72dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  회비 유형 선택
                </h3>
                <p className="mt-1 text-xs text-stone-400">
                  선수별로 적용할 회비를 선택하세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  value == ""
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-stone-50 text-stone-700"
                }`}
              >
                회비 미설정
                {value === "" && <Check className="h-4 w-4" />}
              </button>

              {feeTypes.map((feeType) => {
                const isSelected = value === feeType.id;

                return (
                  <button
                    key={feeType.id}
                    type="button"
                    onClick={() => handleSelect(feeType.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-50 text-stone-700"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {feeType.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-stone-400">
                        {feeType.amount.toLocaleString()}원
                      </span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
