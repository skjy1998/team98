import type { MatchCreateFormValue, MatchItem, MatchType } from "@/types/match";
import { useEffect, useState } from "react";
import MatchInfoFieldCard from "./MatchInfoFieldCard";

interface MatchInfoEditorProps {
  match: MatchItem;
  onCancel: () => void;
  onSave: (value: MatchCreateFormValue) => void;
}

export default function MatchInfoEditor({
  match,
  onCancel,
  onSave,
}: Readonly<MatchInfoEditorProps>) {
  const [type, setType] = useState<MatchType>(match.type);
  const [date, setDate] = useState(match.date);
  const [startTime, setStartTime] = useState(match.startTime);
  const [endTime, setEndTime] = useState(match.endTime);
  const [opponent, setOpponent] = useState(match.opponent ?? "");
  const [location, setLocation] = useState(match.location ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setType(match.type);
    setDate(match.date);
    setStartTime(match.startTime);
    setEndTime(match.endTime);
    setOpponent(match.opponent ?? "");
    setLocation(match.location ?? "");
    setErrorMessage("");
  }, [match]);

  const handleChangeType = (nextType: MatchType) => {
    setType(nextType);

    if (nextType === "자체전") {
      setOpponent("");
    }
  };

  const handleSubmit = () => {
    if (!date) {
      setErrorMessage("날짜를 선택해 주세요.");
      return;
    }

    if (!startTime || !endTime) {
      setErrorMessage("시작 시간과 종료 시간을 모두 입력해 주세요.");
      return;
    }

    if (startTime >= endTime) {
      setErrorMessage("종료 시간은 시작 시간보다 늦어야 해요.");
      return;
    }

    if (type === "정규" && !opponent.trim()) {
      setErrorMessage("정규 경기는 상대팀을 입력해 주세요.");
      return;
    }

    setErrorMessage("");

    onSave({
      title: type === "정규" ? `vs ${opponent || "상대팀 미정"}` : "자체전",
      type,
      date,
      startTime,
      endTime,
      opponent: type === "정규" ? opponent : "",
      location,
      uniform: "home",
    });
  };

  const dateTimeFields = [
    {
      id: "edit-match-date",
      label: "날짜",
      type: "date" as const,
      value: date,
      onChange: setDate,
    },
    {
      id: "edit-match-start-time",
      label: "시작 시간",
      type: "time" as const,
      value: startTime,
      onChange: setStartTime,
    },
    {
      id: "edit-match-end-time",
      label: "종료 시간",
      type: "time" as const,
      value: endTime,
      onChange: setEndTime,
    },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-900">경기 정보 수정</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            저장
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">경기 유형</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleChangeType("정규")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  type === "정규"
                    ? "bg-emerald-600 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                정규
              </button>
              <button
                type="button"
                onClick={() => handleChangeType("자체전")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  type === "자체전"
                    ? "bg-sky-600 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                자체전
              </button>
            </div>
          </div>
          {dateTimeFields.map((field) => (
            <MatchInfoFieldCard key={field.id} label={field.label}>
              <input
                id={field.id}
                type={field.type}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
              />
            </MatchInfoFieldCard>
          ))}
        </div>

        {type === "정규" && (
          <MatchInfoFieldCard label="상대팀">
            <input
              id="edit-match-opponent"
              value={opponent}
              onChange={(event) => setOpponent(event.target.value)}
              placeholder="상대팀을 입력하세요"
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
            />
          </MatchInfoFieldCard>
        )}

        <MatchInfoFieldCard label="장소">
          <input
            id="edit-match-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="장소를 입력하세요"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
          />
        </MatchInfoFieldCard>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {errorMessage}
          </div>
        )}
      </div>
    </section>
  );
}
