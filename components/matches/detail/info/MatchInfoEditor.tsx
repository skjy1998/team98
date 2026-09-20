import type { MatchCreateFormValue, MatchItem } from "@/types/match";
import MatchInfoFieldCard from "./MatchInfoFieldCard";
import MatchFormatSection from "../../MatchFormatSection";
import { useMatchInfoEditor } from "@/hooks/matches/useMatchInfoEditor";
import MatchSportSelector from "../../MatchSportSelector";
import MatchUniformSelector from "../../MatchUniformSelector";
import MatchInfoScheduleFields from "./MatchInfoScheduleFields";
import MatchTypeSelector from "../../MatchTypeSelector";

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
    handleChangeSport,
  } = useMatchInfoEditor({
    match,
    onSave,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
          경기 정보 수정
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-emerald-600"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      <fieldset
        disabled={isSubmitting}
        className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
      >
        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="mb-3 text-sm font-semibold text-stone-700">경기 종목</p>

          <MatchSportSelector
            value={form.sport}
            onChange={handleChangeSport}
            disabled={isSubmitting}
          />
        </div>

        <MatchFormatSection
          sport={form.sport}
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
        <div className="grid gap-3 md:grid-cols-2 sm:gap-4">
          <MatchTypeSelector
            value={form.type}
            onChange={handleChangeType}
            disabled={isSubmitting}
          />
          <MatchInfoScheduleFields
            value={form}
            onChange={(field, value) => updateField(field, value)}
          />
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

        <MatchInfoFieldCard label="유니폼">
          <MatchUniformSelector
            value={form.uniform}
            onChange={(value) => updateField("uniform", value)}
            disabled={isSubmitting}
          />
        </MatchInfoFieldCard>
        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
          >
            {errorMessage}
          </div>
        )}
      </fieldset>
    </form>
  );
}
