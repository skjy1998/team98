interface MatchCreateScheduleSectionProps {
  date: string;
  onChangeDate: (value: string) => void;
  startTime: string;
  onChangeStartTime: (value: string) => void;
  endTime: string;
  onChangeEndTime: (value: string) => void;
  voteDeadline: string;
  onChangeVoteDeadline: (value: string) => void;
}

export default function MatchCreateScheduleSection({
  date,
  onChangeDate,
  startTime,
  onChangeStartTime,
  endTime,
  onChangeEndTime,
  voteDeadline,
  onChangeVoteDeadline,
}: Readonly<MatchCreateScheduleSectionProps>) {
  return (
    <section className="space-y-5 md:space-y-6">
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
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none transition focus:border-emerald-300 md:h-16 md:px-5 md:text-lg"
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-stone-900">시간</p>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
            필수
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 sm:gap-3">
          <div className="space-y-2">
            <label
              htmlFor="match-start-time"
              className="text-xs font-semibold text-stone-700 sm:text-sm"
            >
              시작 시간
            </label>
            <input
              id="match-start-time"
              type="time"
              value={startTime}
              onChange={(event) => onChangeStartTime(event.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none transition focus:border-emerald-300 md:h-16 md:px-5 md:text-lg"
            />
          </div>

          <span className="pb-3.5 text-center text-base font-medium text-stone-400 sm:pb-5 sm:text-xl">
            -
          </span>

          <div className="space-y-2">
            <label
              htmlFor="match-end-time"
              className="text-xs font-semibold text-stone-700 sm:text-sm"
            >
              종료 시간
            </label>
            <input
              id="match-end-time"
              type="time"
              value={endTime}
              onChange={(event) => onChangeEndTime(event.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none transition focus:border-emerald-300 md:h-16 md:px-5 md:text-lg"
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="match-vote-deadline"
            className="text-lg font-semibold text-stone-900"
          >
            투표 마감
          </label>
          <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
            필수
          </span>
        </div>
        <input
          id="match-vote-deadline"
          type="datetime-local"
          value={voteDeadline}
          onChange={(event) => onChangeVoteDeadline(event.target.value)}
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-800 outline-none transition focus:border-emerald-300 md:h-16 md:px-5 md:text-lg"
        />
      </div>
    </section>
  );
}
