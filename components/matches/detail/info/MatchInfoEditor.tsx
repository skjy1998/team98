import type { MatchCreateFormValue, MatchItem } from "@/types/match";

import MatchInfoFieldCard from "./MatchInfoFieldCard";

import MatchFormatSection from "../../MatchFormatSection";
import { useMatchInfoEditor } from "@/hooks/matches/useMatchInfoEditor";

interface MatchInfoEditorProps {
  match: MatchItem;
  onCancel: () => void;
  onSave: (value: MatchCreateFormValue) => Promise<void>;
}

export default function MatchInfoEditor({
  match,
  onCancel,
  onSave,
}: Readonly<MatchInfoEditorProps>) {
  const {
    form,
    errorMessage,
    isSubmitting,
    updateField,
    handleChangeType,
    handleSubmit,
  } = useMatchInfoEditor({
    match,
    onSave,
  });

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
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <MatchFormatSection
          sport={match.sport}
          playersPerSide={form.playersPerSide}
          onChangePlayersPerSide={(value) =>
            updateField("playersPerSide", value)
          }
          quarterCount={form.quarterCount}
          onChangeQuarterCount={(value) => updateField("quarterCount", value)}
          quarterDurationMinutes={form.quarterDurationMinutes}
          onChangeQuarterDurationMinutes={(value) =>
            updateField("quarterDurationMinutes", value)
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">경기 유형</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleChangeType("정규")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  form.type === "정규"
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
                  form.type === "자체전"
                    ? "bg-sky-600 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                자체전
              </button>
            </div>
          </div>
          <MatchInfoFieldCard label="날짜">
            <input
              id="edit-match-date"
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
            />
          </MatchInfoFieldCard>

          <MatchInfoFieldCard label="경기 시간">
            <div className="grid items-center gap-2 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <label htmlFor="edit-match-start-time" className="sr-only">
                  시작 시간
                </label>
                <input
                  id="edit-match-start-time"
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    updateField("startTime", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
                />
              </div>

              <span className="text-stone-400">-</span>

              <div>
                <label htmlFor="edit-match-end-time" className="sr-only">
                  종료 시간
                </label>
                <input
                  id="edit-match-end-time"
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    updateField("endTime", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
                />
              </div>
            </div>
          </MatchInfoFieldCard>

          <MatchInfoFieldCard label="투표 마감">
            <input
              id="edit-match-vote-deadline"
              type="datetime-local"
              value={form.voteDeadline}
              onChange={(event) =>
                updateField("voteDeadline", event.target.value)
              }
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-emerald-300"
            />
          </MatchInfoFieldCard>
        </div>

        {form.type === "정규" && (
          <MatchInfoFieldCard label="상대팀">
            <input
              id="edit-match-opponent"
              value={form.opponent}
              onChange={(event) => updateField("opponent", event.target.value)}
              placeholder="상대 팀 이름을 입력하세요"
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-300 focus:border-emerald-300"
            />
          </MatchInfoFieldCard>
        )}

        <MatchInfoFieldCard label="장소">
          <input
            id="edit-match-location"
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="경기 장소를 입력하세요"
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
