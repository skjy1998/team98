import { createQuarterOptions } from "@/lib/matches/match-quarter";
import type {
  MatchRecordEvent,
  MatchRecordQuarter,
  MatchType,
} from "@/types/match";
import type { PlayerType } from "@/types/player";
import { useMemo, useState } from "react";

interface MatchRecordEditPanelProps {
  event: MatchRecordEvent;
  matchType: MatchType;
  quarterCount: number;
  quarterDurationMinutes: number;
  attendPlayers: PlayerType[];
  onCancel: () => void;
  onSubmit: (
    eventId: string,
    updates: {
      playerId: string;
      assistPlayerId: string;
      quarter: MatchRecordQuarter;
      minute: string;
    },
  ) => void | Promise<void>;
}

export default function MatchRecordEditPanel({
  event,
  matchType,
  quarterCount,
  quarterDurationMinutes,
  attendPlayers,
  onCancel,
  onSubmit,
}: Readonly<MatchRecordEditPanelProps>) {
  const quarterOptions = useMemo<MatchRecordQuarter[]>(
    () => ["unknown", ...createQuarterOptions(quarterCount)],
    [quarterCount],
  );

  const initialQuarter =
    event.quarter && quarterOptions.includes(event.quarter)
      ? event.quarter
      : "unknown";

  const [playerId, setPlayerId] = useState(event.playerId ?? "");
  const [assistPlayerId, setAssistPlayerId] = useState(
    event.assistPlayerId ?? "",
  );
  const [quarter, setQuarter] = useState<MatchRecordQuarter>(initialQuarter);
  const [minute, setMinute] = useState(event.minute ?? "");
  const [minuteError, setMinuteError] = useState("");

  const canEditPlayerRecord = event.type === "goal" || matchType === "자체전";

  const scoringTeamLabel =
    matchType === "자체전" ? (event.type === "goal" ? "A팀" : "B팀") : "";

  const handleSubmit = async () => {
    if (minute) {
      const minuteValue = Number(minute);

      if (
        !Number.isInteger(minuteValue) ||
        minuteValue < 0 ||
        minuteValue > quarterDurationMinutes
      ) {
        setMinuteError(
          `경기 시간은 0분부터 ${quarterDurationMinutes}분까지 입력해 주세요.`,
        );
        return;
      }
    }

    setMinuteError("");

    await onSubmit(event.id, {
      playerId,
      assistPlayerId,
      quarter,
      minute,
    });
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-stone-50/80 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">기록 수정 중</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-stone-500 transition hover:text-stone-700"
        >
          취소
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {canEditPlayerRecord && (
          <>
            <div>
              <p className="mb-3 text-sm font-semibold text-stone-700">
                {scoringTeamLabel ? `${scoringTeamLabel} 득점자` : "득점자"}
              </p>
              <div className="flex flex-wrap gap-2">
                {attendPlayers.map((player) => {
                  const isActive = playerId === player.id;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => setPlayerId(player.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-amber-500 text-white"
                          : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {player.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-stone-700">
                {scoringTeamLabel ? `${scoringTeamLabel} 어시스트` : "어시스트"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAssistPlayerId("")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    assistPlayerId === ""
                      ? "bg-stone-900 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  없음
                </button>

                {attendPlayers.map((player) => {
                  const isActive = assistPlayerId === player.id;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => setAssistPlayerId(player.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {player.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold text-stone-700">쿼터</p>
          <div className="grid grid-cols-5 gap-2">
            {quarterOptions.map((item) => {
              const isActive = quarter === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuarter(item)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {item === "unknown" ? "모름" : item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">
            시간
          </label>
          <input
            type="number"
            min={0}
            max={quarterDurationMinutes}
            step={1}
            value={minute}
            onChange={(event) => {
              setMinute(event.target.value);
              setMinuteError("");
            }}
            placeholder={`0~${quarterDurationMinutes}분`}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
          />
          {minuteError && (
            <p className="mt-2 text-sm font-medium text-rose-500">
              {minuteError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            수정 완료
          </button>
        </div>
      </div>
    </section>
  );
}
