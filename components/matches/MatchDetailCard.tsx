import { MatchTab, MatchType } from "@/types/match";

interface MatchDetailCardProps {
  match: MatchType | undefined;
  activeTab: MatchTab;
  onTabChange: (tab: MatchTab) => void;
  onRecordOpen: () => void;
  onRecordDelete: (eventId: string) => void;
}

export default function MatchDetailCard({
  match,
  activeTab,
  onTabChange,
  onRecordOpen,
  onRecordDelete,
}: Readonly<MatchDetailCardProps>) {
  if (!match) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <div className="text-sm text-gray-500">선택된 경기가 없습니다.</div>
      </div>
    );
  }
  const result =
    Number(match.ourScore) > Number(match.opponentScore)
      ? "승리"
      : Number(match.ourScore) < Number(match.opponentScore)
        ? "패배"
        : "무승부";
  const resultClass =
    result === "승리"
      ? "bg-green-100 text-green-600"
      : result === "패배"
        ? "bg-red-100 text-red-500"
        : "bg-gray-100 text-gray-500";

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* 경기 날짜 시간 장소 */}
      <div>
        <div className="text-center text-sm text-gray-500">
          {match.date} {match.time} | {match.location}
        </div>
        {/* 경기 스코어 */}
        <div className="mt-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
            <div className="flex items-center justify-end gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 font-black">
                FC
              </div>
              <h2 className="text-lg font-bold">FC United</h2>
            </div>

            <div className="text-center">
              {match.status === "종료" ? (
                <div className="text-5xl font-black tracking-tight whitespace-nowrap">
                  {match.ourScore} : {match.opponentScore}
                </div>
              ) : (
                <div className="text-3xl font-black text-gray-400">VS</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{match.opponent}</h2>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-black">
                {match.opponent.slice(0, 2)}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            {match.status === "종료" ? (
              <div
                className={`w-fit rounded-md px-3 py-1 text-sm font-bold ${resultClass}`}
              >
                {Number(match.ourScore) > Number(match.opponentScore)
                  ? "승리"
                  : Number(match.ourScore) < Number(match.opponentScore)
                    ? "패배"
                    : "무승부"}
              </div>
            ) : (
              <div className="w-fit rounded-md bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500">
                예정 경기
              </div>
            )}
          </div>
        </div>
        {/* 경기 상세 탭*/}
        <div className="mt-8 border-t">
          <div className="grid grid-cols-3">
            {(["기록", "라인업", "통계"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`border-b-2 py-4 text-sm font-bold transition ${
                    isActive
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover: text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          {/* 경기 기록 */}
          <div className="pt-6">
            {activeTab === "기록" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">경기 기록</h3>

                  <button
                    type="button"
                    onClick={onRecordOpen}
                    className="rounded-lg bg-green-500 px-3 py-2 text-sm font-bold text-white"
                  >
                    + 기록 추가
                  </button>
                </div>
                {match.events.length > 0 ? (
                  <div className="divided-y">
                    {match.events.map((event) => (
                      <div
                        key={event.id}
                        className="grid grid-cols-[60px_40px_1fr_auto_auto] items-center py-4 text-sm"
                      >
                        <span className="font-bold">{event.minute}</span>
                        <span className="text-xl">
                          {event.type === "goal"
                            ? "⚽️"
                            : event.type === "yellow"
                              ? "🟨"
                              : event.type === "red"
                                ? "🟥"
                                : "🔄"}
                        </span>
                        <span className="font-medium">{event.playerName}</span>
                        <span className="text-gray-500">{event.detail}</span>
                        <button
                          type="button"
                          onClick={() => onRecordDelete(event.id)}
                          className="m-6 text-xs font-bold text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                    등록된 경기 기록이 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
