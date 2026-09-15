import type { MatchCreateFormValue } from "@/types/match";

import MatchInfoFieldCard from "./MatchInfoFieldCard";

type ScheduleField = "date" | "startTime" | "endTime" | "voteDeadline";

interface MatchInfoScheduleFieldsProps {
  value: Pick<
    MatchCreateFormValue,
    "date" | "startTime" | "endTime" | "voteDeadline"
  >;
  onChange: (field: ScheduleField, value: string) => void;
}

export default function MatchInfoScheduleFields({
  value,
  onChange,
}: Readonly<MatchInfoScheduleFieldsProps>) {
  return (
    <>
      <MatchInfoFieldCard label="날짜">
        <input
          id="edit-match-date"
          type="date"
          value={value.date}
          onChange={(event) => onChange("date", event.target.value)}
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />
      </MatchInfoFieldCard>

      <MatchInfoFieldCard label="경기 시간">
        <div className="grid items-center gap-2 md:grid-cols-[1fr_auto_1fr]">
          <input
            aria-label="시작 시간"
            type="time"
            value={value.startTime}
            onChange={(event) => onChange("startTime", event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
          />

          <span className="text-stone-400">-</span>

          <input
            aria-label="종료 시간"
            type="time"
            value={value.endTime}
            onChange={(event) => onChange("endTime", event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
          />
        </div>
      </MatchInfoFieldCard>

      <MatchInfoFieldCard label="투표 마감">
        <input
          type="datetime-local"
          value={value.voteDeadline}
          onChange={(event) => onChange("voteDeadline", event.target.value)}
          className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
        />
      </MatchInfoFieldCard>
    </>
  );
}
