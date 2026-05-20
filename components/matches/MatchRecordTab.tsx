import { MatchEvent } from "@/types/match";

interface MatchRecordTabProps {
  events: MatchEvent[];
  onRecordOpen: () => void;
  onRecordDelete: (eventId: string) => void;
}

const getEventIcon = (type: MatchEvent["type"]) => {
  switch (type) {
    case "goal":
      return "⚽️";
    case "yellow":
      return "🟨";
    case "red":
      return "🟥";
    case "substitution":
      return "🔄";
  }
};

export default function MatchRecordTab({
  events,
  onRecordOpen,
  onRecordDelete,
}: Readonly<MatchRecordTabProps>) {
  return (
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
      {events.length > 0 ? (
        <div className="divided-y">
          {events.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-[60px_40px_1fr_auto_auto] items-center py-4 text-sm"
            >
              <span className="font-bold">{event.minute}</span>
              <span className="text-xl">{getEventIcon(event.type)}</span>
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
  );
}
