import { usePlayers } from "@/hooks/usePlayers";
import type {
  MatchRecordEvent,
  MatchRecordEventType,
} from "@/hooks/useMatchRecords";

interface MatchRecordTabProps {
  events: MatchRecordEvent[];
  recordsLoaded: boolean;
  addEvent: (type: MatchRecordEventType) => void;
  deleteEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<MatchRecordEvent>) => void;
}

export default function MatchRecordTab({
  events,
  recordsLoaded,
  addEvent,
  deleteEvent,
  updateEvent,
}: Readonly<MatchRecordTabProps>) {
  const { players, loaded } = usePlayers();

  const handlePlayerChange = (eventId: string, playerId: string) => {
    const selectedPlayer = players.find((player) => player.id === playerId);

    updateEvent(eventId, {
      playerId,
      playerName: selectedPlayer?.name ?? "",
    });
  };

  const handleMinuteChange = (eventId: string, minute: string) => {
    updateEvent(eventId, { minute });
  };

  if (!loaded || !recordsLoaded) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
        <p className="text-sm text-stone-500">기록 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">
          경기 스코어 반영
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => addEvent("goal")}
            className="h-16 rounded-2xl bg-emerald-100 text-lg font-semibold text-emerald-700 transition hover:bg-emerald-200"
          >
            + 득점
          </button>

          <button
            type="button"
            onClick={() => addEvent("concede")}
            className="h-16 rounded-xl bg-rose-100 text-lg font-semibold text-rose-600 transition hover:bg-rose-200"
          >
            + 실점
          </button>
        </div>

        <p className="mt-3 text-sm text-stone-400">
          득점과 실점을 추가하면 상단 전광판 점수에도 바로 반영돼요.
        </p>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">골 기록 추가</h2>
          <p className="text-sm text-stone-400">{events.length}개 기록</p>
        </div>

        <div className="mt-5 space-y-3">
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
              <p className="text-sm text-stone-500">
                아직 추가된 경기 기록이 없어요.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        event.type === "goal"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {event.type === "goal" ? "득점" : "실점"}
                    </span>

                    <p className="text-sm text-stone-500">
                      {event.type === "goal"
                        ? "우리팀 득점 기록"
                        : "상대팀 실점 기록"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                  >
                    삭제
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_120px]">
                  <select
                    value={event.playerId ?? ""}
                    onChange={(e) =>
                      handlePlayerChange(event.id, e.target.value)
                    }
                    className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
                  >
                    <option value="">선수 선택</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>

                  <input
                    value={event.minute ?? ""}
                    onChange={(e) =>
                      handleMinuteChange(event.id, e.target.value)
                    }
                    placeholder="시간"
                    className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
