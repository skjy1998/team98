import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

interface FinanceDueDayCardProps {
  canManage: boolean;
  dueDay: string;
  onChangeDueDay: (value: string) => Promise<boolean>;
}

export default function FinanceDueDayCard({
  canManage,
  dueDay,
  onChangeDueDay,
}: Readonly<FinanceDueDayCardProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleChangeDueDay = async (value: string) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onChangeDueDay(value);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
        납부 기준일
      </p>
      <div className="relative">
        <select
          value={dueDay}
          onChange={(event) => handleChangeDueDay(event.target.value)}
          disabled={!canManage || isSubmitting}
          className={`h-11 w-full appearance-none rounded-xl px-3 pr-10 text-sm font-semibold outline-none sm:h1=-12 sm:px-4 sm:pr-11 sm:text-base ${
            canManage && !isSubmitting
              ? "border-stone-200 bg-stone-50 text-stone-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          }`}
        >
          {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
            <option key={day} value={String(day)}>
              매월 {day}일
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 sm:right-4"
        />
      </div>

      {isSubmitting && (
        <p className="mt-1.5 text-xs text-stone-400 sm:mt-2 sm:text-sm">
          납부 기준일을 저장하는 중...
        </p>
      )}
    </div>
  );
}
