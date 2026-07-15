import { MatchCreateFormValue, MatchType, MatchUniform } from "@/types/match";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MatchCreateTypeSection from "./MatchCreateTypeSection";
import MatchCreateScheduleSection from "./MatchCreateScheduleSection";
import MatchCreateUniformSection from "./MatchCreateUniformSection";
import MatchCreateOpponentSection from "./MatchCreateOpponentSection";
import MatchCreateLocationSection from "./MatchCreateLocationSection";
import { getMatchCreateDefaults } from "@/lib/match-ui";

interface MatchCreateModalProps {
  onClose: () => void;
  onSave: (value: MatchCreateFormValue) => void;
}

export default function MatchCreateModal({
  onClose,
  onSave,
}: Readonly<MatchCreateModalProps>) {
  const { defaultDate, defaultStartTime, defaultEndTime, defaultLocation } =
    useMemo(() => getMatchCreateDefaults(), []);

  const [type, setType] = useState<MatchType>("정규");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const [uniform, setUniform] = useState<MatchUniform>("home");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleSave = () => {
    const title =
      type === "정규" ? `vs ${opponent || "상대팀 미정"}` : "자체전";

    onSave({
      title,
      type,
      date,
      startTime,
      endTime,
      opponent: type === "정규" ? opponent : "",
      location,
      uniform,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <button
        type="button"
        aria-label="일정 등록 모달 닫기"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">일정 등록</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            새 경기 추가하기
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            경기 종류와 일정, 장소를 먼저 등록하고 세부 내용은 나중에 수정할 수
            있어요.
          </p>
        </div>
        <div className="space-y-7">
          <MatchCreateTypeSection type={type} onChangeType={setType} />
          <MatchCreateScheduleSection
            date={date}
            onChangeDate={setDate}
            startTime={startTime}
            onChangeStartTime={setStartTime}
            endTime={endTime}
            onChangeEndTime={setEndTime}
          />
          <MatchCreateOpponentSection
            type={type}
            opponent={opponent}
            onChangeOpponent={setOpponent}
          />
          <MatchCreateLocationSection
            location={location}
            onChangeLocation={setLocation}
          />
          <MatchCreateUniformSection
            uniform={uniform}
            onChangeUniform={setUniform}
          />
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-12 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
