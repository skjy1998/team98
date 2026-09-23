import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface TacticsMobileSelectProps {
  label: string;
  description: string;
  value: string;
  options: readonly { value: string; label: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
}

export default function TacticsMobileSelect({
  label,
  description,
  value,
  options,
  disabled,
  onChange,
}: Readonly<TacticsMobileSelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 text-left text-sm font-semibold text-stone-800 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
        >
          <span>{selected?.label}</span>
          <ChevronDown className="h-4 w-4 text-stone-400" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label={`${label} 선택 닫기`}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/35"
          />
          <section className="absolute inset-x-0 bottom-0 max-h-[72dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  {label}
                </h3>
                <p className="mt-1 text-xs text-stone-400">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="rounded-lg p-2 text-stone-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-50 text-stone-700"
                    }`}
                  >
                    {option.label}
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
