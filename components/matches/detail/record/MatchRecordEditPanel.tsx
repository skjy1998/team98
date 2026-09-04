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
            <MatchRecordPlayerPicker
              label={scoringTeamLabel ? `${scoringTeamLabel} 득점자` : "득점자"}
              players={attendPlayers}
              selectedPlayerId={playerId}
              onChange={setPlayerId}
              variant="scorer"
            />

            <MatchRecordPlayerPicker
              label={
                scoringTeamLabel ? `${scoringTeamLabel} 어시스트` : "어시스트"
              }
              players={attendPlayers}
              selectedPlayerId={assistPlayerId}
              onChange={setAssistPlayerId}
              allowEmpty
              variant="assist"
            />
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
            onChange={(event) => handleChangeMinute(event.target.value)}
            placeholder={`0~${quarterDurationMinutes}분`}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
          />
          {errorMessage && (
            <p className="mt-2 text-sm font-medium text-rose-500">
              {errorMessage}
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
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isSubmitting ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </div>
    </section>
  );
}
