import { MatchEvent } from "@/types/match";
import { useState } from "react";

interface MatchRecordModalProps {
  onClose: () => void;
  onSave: (event: MatchEvent) => void;
}

export default function MatchRecordModal({
  onClose,
  onSave,
}: Readonly<MatchRecordModalProps>) {
  const [minute, setMinute] = useState("");
  const [eventType, setEventType] = useState<MatchEvent["type"]>("goal");
  const [playerName, setPlayerName] = useState("");
  const [detail, setDetail] = useState("");

  const handleSubmit = () => {
    if (!minute || !playerName) {
      alert("시간과 선수명을 입력해주세요");
      return;
    }
    onSave({
      id: crypto.randomUUID(),
      minute,
      type: eventType,
      playerName,
      detail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center justify-center bg-black/30">
      <div className="w-[480px] rounded-xl bg-white p-6 space-y-4">
        <h2 className="text-lg font-bold">기록 추가</h2>
        <input
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          placeholder="시간 예: 10"
          className="w-full rounded-lg border px-3 py-2"
        />
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as MatchEvent["type"])}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="goal">득점</option>
          <option value="yellow">경고</option>
          <option value="red">퇴장</option>
          <option value="substitution">교체</option>
        </select>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="선수명"
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="상세 기록 예: 1 : 0 득점"
          className="w-full rounded-lg border px-3 py-2"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
