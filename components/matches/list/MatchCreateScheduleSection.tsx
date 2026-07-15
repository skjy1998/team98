interface MatchCreateScheduleSectionProps {
  date: string;
  onChangeDate: (value: string) => void;
  startTime: string;
  onChangeStartTime: (value: string) => void;
  endTime: string;
  onChangeEndTime: (value: string) => void;
}

export default function MatchCreateScheduleSection({
  date,
  onChangeDate,
  startTime,
  onChangeStartTime,
  endTime,
  onChangeEndTime,
}: Readonly<MatchCreateScheduleSectionProps>) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="match-date"
            className="text-lg font-semibold text-stone-900"
          >
            날짜
          </label>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
            필수
          </span>
        </div>

        <input
          id="match-date"
          type="date"
          value={date}
          onChange={(event) => onChangeDate(event.target.value)}
          className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-stone-900">시간</p>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
            필수
          </span>
        </div>

        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-2">
            <label
              htmlFor="match-start-time"
              className="text-sm font-semibold text-stone-700"
            >
              시작 시간
            </label>
            <input
              id="match-start-time"
              type="time"
              value={startTime}
              onChange={(event) => onChangeStartTime(event.target.value)}
              className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
            />
          </div>

          <span className="pb-5 text-center text-xl font-medium text-stone-400">
            -
          </span>

          <div className="space-y-2">
            <label
              htmlFor="match-end-time"
              className="text-sm font-semibold text-stone-700"
            >
              종료 시간
            </label>
            <input
              id="match-end-time"
              type="time"
              value={endTime}
              onChange={(event) => onChangeEndTime(event.target.value)}
              className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
