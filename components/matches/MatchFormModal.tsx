import { MatchType } from "@/types/match";
import { useState } from "react";

interface MatchFormModalProps {
  onClose: () => void;
  onSave: (match: MatchType) => void;
}

export default function MatchFormModal({
  onClose,
  onSave,
}: Readonly<MatchFormModalProps>) {
  // 일정 추가 모달 상태
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState<"홈" | "원정">("홈");
  const [status, setStatus] = useState<"예정" | "종료">("예정");
  const [ourScore, setOurScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");

  // 일정 추가 저장 함수
  const handleSubmit = () => {
    if (!opponent || !date || !time || !location) {
      alert("필수값을 입력해주세요");
      return;
    }
    onSave({
      id: crypto.randomUUID(),
      opponent,
      date,
      time,
      location,
      venue,
      status,
      ourScore: status === "종료" ? Number(ourScore) : undefined,
      opponentScore: status === "종료" ? Number(opponentScore) : undefined,
      events: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[520px] rounded-xl bg-white p-6 space-y-4">
        <h2 className="text-lg font-bold">일정 추가</h2>
        <input
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="상대팀"
          className="w-full rounded-lg border px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            type="time"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="장소"
          className="w-full rounded-lg border px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={venue}
            onChange={(e) => setVenue(e.target.value as "홈" | "원정")}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="홈">홈</option>
            <option value="원정">원정</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "예정" | "종료")}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="예정">예정</option>
            <option value="종료">종료</option>
          </select>
        </div>
        {status === "종료" && (
          <div className="grid grid-cols-2 gap-3">
            <input
              value={ourScore}
              onChange={(e) => setOurScore(e.target.value)}
              type="number"
              placeholder="우리팀 점수"
              className="w-full rounded-lg border px-3 py-2"
            />
            <input
              value={opponentScore}
              onChange={(e) => setOpponentScore(e.target.value)}
              type="number"
              placeholder="상대팀 점수"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        )}
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
