import { MatchCreateFormValue, MatchType, MatchUniform } from "@/types/match";
import { MapPin, X } from "lucide-react";
import { useState } from "react";

interface MatchCreateModalProps {
  onClose: () => void;
  onSave: (value: MatchCreateFormValue) => void;
}

export default function MatchCreateModal({
  onClose,
  onSave,
}: Readonly<MatchCreateModalProps>) {
  const [type, setType] = useState<MatchType>("정규");
  const [date, setDate] = useState("2026-05-26");
  const [startTime, setStartTime] = useState("20:00");
  const [endTime, setEndTime] = useState("22:00");
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState("데모 체육공원 축구장");
  const [uniform, setUniform] = useState<MatchUniform>("home");

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
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">일정 등록</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            새 경기 추가하기
          </h2>
        </div>
        <div className="space-y-7">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-lg font-semibold text-stone-900">
                경기 종류
              </label>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
                필수
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("정규")}
                className={`rounded-xl border px-6 py-5 text-center transition ${
                  type === "정규"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                    : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
                }`}
              >
                <p className="text-2xl font-bold">정규</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    type === "정규" ? "text-emerald-400" : "text-stone-400"
                  }`}
                >
                  상대팀
                </p>
              </button>
              <button
                type="button"
                onClick={() => setType("자체전")}
                className={`rounded-xl border px-6 py-5 text-center transition ${
                  type === "자체전"
                    ? "border-sky-300 bg-sky-50 text-sky-600"
                    : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
                }`}
              >
                <p className="text-2xl font-bold">자체전</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    type === "자체전" ? "text-sky-400" : "text-stone-400"
                  }`}
                >
                  우리끼리
                </p>
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="match-date"
                className="text-lg font-semibold text-stone-900"
              >
                날짜
              </label>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
                필수
              </span>
            </div>
            <div className="relative">
              <input
                id="match-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
              />
            </div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-lg font-semibold text-stone-900">
                시간
              </label>
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-500">
                필수
              </span>
            </div>

            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
                />
              </div>

              <span className="text-center text-2xl font-semibold text-stone-300">
                -
              </span>

              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition focus:border-emerald-300"
                />
              </div>
            </div>
          </section>
          {type === "정규" && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="match-opponent"
                  className="text-lg font-semibold text-stone-900"
                >
                  상대팀
                </label>
                <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                  선택
                </span>
              </div>

              <input
                id="match-opponent"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="예: FC 강남"
                className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
              />
            </section>
          )}

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="match-location"
                className="text-lg font-semibold text-stone-900"
              >
                장소
              </label>
              <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                선택
              </span>
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-300" />
              <input
                id="match-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="장소를 입력하세요"
                className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-lg font-semibold text-stone-900">
                유니폼
              </label>
              <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                선택
              </span>
            </div>

            <div className="grid grid-cols-2 rounded-2xl border border-stone-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setUniform("home")}
                className={`rounded-[18px] px-5 py-4 text-lg font-semibold transition ${
                  uniform === "home"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-stone-500"
                }`}
              >
                홈
              </button>

              <button
                type="button"
                onClick={() => setUniform("away")}
                className={`rounded-[18px] px-5 py-4 text-lg font-semibold transition ${
                  uniform === "away"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-500"
                }`}
              >
                어웨이
              </button>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-12 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
