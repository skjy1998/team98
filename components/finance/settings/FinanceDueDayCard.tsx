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
      <p className="mb-2 text-sm font-medium text-stone-500">납부 기준일</p>
      <select
        value={dueDay}
        onChange={(event) => handleChangeDueDay(event.target.value)}
        disabled={!canManage || isSubmitting}
        className={`w-full rounded-xl border px-5 py-4 text-base font-semibold outline-none ${
          canManage && !isSubmitting
            ? "border-stone-200 bg-stone-50 text-stone-900 focus:border-orange-300"
            : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
        }`}
      >
        {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
          <option key={day} value={String(day)}>
            매월 {day}일
          </option>
        ))}
      </select>
      {isSubmitting && (
        <p className="mt-2 text-sm text-stone-400">
          납부 기준일을 저장하는 중...
        </p>
      )}
    </div>
  );
}
