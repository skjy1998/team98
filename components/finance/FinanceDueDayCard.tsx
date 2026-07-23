interface FinanceDueDayCardProps {
  canManage: boolean;
  dueDay: string;
  onChangeDueDay: (value: string) => void;
}

export default function FinanceDueDayCard({
  canManage,
  dueDay,
  onChangeDueDay,
}: Readonly<FinanceDueDayCardProps>) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-stone-500">납부 기준일</p>
      <select
        value={dueDay}
        onChange={(event) => onChangeDueDay(event.target.value)}
        disabled={!canManage}
        className={`w-full rounded-xl border px-5 py-4 text-base font-semibold outline-none ${
          canManage
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
    </div>
  );
}
