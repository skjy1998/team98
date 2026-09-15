import { useMatchRecordEditForm } from "@/hooks/matches/useMatchRecordEditForm";
import type {
  MatchRecordEditValue,
  MatchRecordEvent,
  MatchType,
} from "@/types/match";
import type { PlayerType } from "@/types/player";
import MatchRecordPlayerPicker from "./MatchRecordPlayerPicker";

interface MatchRecordEditPanelProps {
  event: MatchRecordEvent;
  matchType: MatchType;
  quarterCount: number;
  quarterDurationMinutes: number;
  attendPlayers: PlayerType[];
  onCancel: () => void;
  onSubmit: (
    eventId: string,
    updates: MatchRecordEditValue,
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
  const {
    quarterOptions,
    playerId,
    assistPlayerId,
    quarter,
    minute,
    errorMessage,
    isSubmitting,
    setPlayerId,
    setAssistPlayerId,
    setQuarter,
    handleChangeMinute,
    handleSubmit,
  } = useMatchRecordEditForm({
    event,
    quarterCount,
    quarterDurationMinutes,
    onSubmit,
  });

  const canEditPlayerRecord = event.type === "goal" || matchType === "자체전";

  const scoringTeamLabel =
    matchType === "자체전" ? (event.type === "goal" ? "A팀" : "B팀") : "";

  return (
    <form
      onSubmit={(submitEvent) => {
        submitEvent.preventDefault();
        void handleSubmit();
      }}
      className="rounded-xl border border-stone-200 bg-stone-50/80 p-6"
    >
      <h3 className="text-lg font-semibold text-stone-900">기록 수정 중</h3>

      <fieldset disabled={isSubmitting} className="mt-6 space-y-6">
        {canEditPlayerRecord && (
          <>
            <MatchRecordPlayerPicker
              label={scoringTeamLabel ? `${scoringTeamLabel} 득점자` : "득점자"}
              players={attendPlayers}
              selectedPlayerId={playerId}
              onChange={setPlayerId}
            />

            <MatchRecordPlayerPicker
              label={
                scoringTeamLabel ? `${scoringTeamLabel} 어시스트` : "어시스트"
              }
              players={attendPlayers}
              selectedPlayerId={assistPlayerId}
              onChange={setAssistPlayerId}
              allowEmpty
            />
          </>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold text-stone-700">쿼터</p>
          <div className="grid grid-cols-5 gap-2 rounded-xl bg-emerald-50/50 p-2">
            {quarterOptions.map((item) => {
              const isActive = quarter === item;

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setQuarter(item)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-100"
                      : "border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {item === "unknown" ? "모름" : item}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="record-edit-minute"
            className="mb-2 block text-sm font-semibold text-stone-700"
          >
            시간
          </label>
          <input
            id="record-edit-minute"
            type="number"
            min={0}
            max={quarterDurationMinutes}
            step={1}
            value={minute}
            onChange={(event) => handleChangeMinute(event.target.value)}
            placeholder={`0~${quarterDurationMinutes}분`}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
          />
          {errorMessage && (
            <p role="alert" className="mt-2 text-sm font-medium text-rose-500">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-12 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
          >
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
