import type { MatchRecordEventType, MatchRecordQuarter } from "@/types/match";
import type { PlayerType } from "@/types/player";

const quaterOptions: MatchRecordQuarter[] = ["unknown", "1Q", "2Q", "3Q", "4Q"];

interface MatchRecordEditPanelProps {
  isOpen: boolean;
  eventType: MatchRecordEventType;
  attendPlayers: PlayerType[];
  editingPlayerId: string;
  editingAssistPlayerId: string;
  editingQuarter: MatchRecordQuarter;
  editingMinute: string;
  onChangePlayerId: (playerId: string) => void;
  onChangeAssistPlayerId: (playerId: string) => void;
  onChangeQuarter: (quarter: MatchRecordQuarter) => void;
  onChangeMinute: (minute: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function MatchRecordEditPanel({
  isOpen,
  eventType,
  attendPlayers,
  editingPlayerId,
  editingAssistPlayerId,
  editingQuarter,
  editingMinute,
  onChangePlayerId,
  onChangeAssistPlayerId,
  onChangeQuarter,
  onChangeMinute,
  onCancel,
  onSubmit,
}: Readonly<MatchRecordEditPanelProps>) {
  if (!isOpen) return null;
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
        {eventType === "goal" && (
          <>
            <div>
              <p className="mb-3 text-sm font-semibold text-stone-700">
                득점자
              </p>
              <div className="flex flex-wrap gap-2">
                {attendPlayers.map((player) => {
                  const isActive = editingPlayerId === player.id;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => onChangePlayerId(player.id)}
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
                어시스트
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onChangeAssistPlayerId("")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    editingAssistPlayerId === ""
                      ? "bg-stone-900 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  없음
                </button>

                {attendPlayers.map((player) => {
                  const isActive = editingAssistPlayerId === player.id;

                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => onChangeAssistPlayerId(player.id)}
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
            {quaterOptions.map((quarter) => {
              const isActive = editingQuarter === quarter;

              return (
                <button
                  key={quarter}
                  type="button"
                  onClick={() => onChangeQuarter(quarter)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {quarter === "unknown" ? "모름" : quarter}
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
            value={editingMinute}
            onChange={(event) => onChangeMinute(event.target.value)}
            placeholder="시간 입력"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
          />
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
            onClick={onSubmit}
            className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            수정 완료
          </button>
        </div>
      </div>
    </section>
  );
}
