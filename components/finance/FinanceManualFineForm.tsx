import type { FineRule } from "@/types/finance";
import type { MatchItem } from "@/types/match";
import type { PlayerType } from "@/types/player";

interface FinanceManualFineFormState {
  ruleId: string;
  onChangeRuleId: (value: string) => void;
  playerId: string;
  onChangePlayerId: (value: string) => void;
  matchId: string;
  onChangeMatchId: (value: string) => void;
  reason: string;
  onChangeReason: (value: string) => void;
}

interface FinanceManualFineFormProps {
  rules: FineRule[];
  players: PlayerType[];
  matches: MatchItem[];
  formState: FinanceManualFineFormState;
  onSubmit: () => void;
}

export default function FinanceManualFineForm({
  rules,
  players,
  matches,
  formState,
  onSubmit,
}: Readonly<FinanceManualFineFormProps>) {
  if (rules.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
        <p className="text-sm text-stone-500">
          설정 탭에서 트리거가 기타인 벌금 규칙을 먼저 등록해주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900">
          기타 벌금 수동 부과
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          자동으로 확인할 수 없는 벌금을 선수에게 직접 부과할 수 있어요.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="manual-fine-rule"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            벌금 규칙
          </label>
          <select
            id="manual-fine-rule"
            value={formState.ruleId}
            onChange={(event) => formState.onChangeRuleId(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
          >
            <option value="">규칙을 선택하세요</option>
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name} · {rule.amount.toLocaleString()}원
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="manual-fine-player"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            선수
          </label>
          <select
            id="manual-fine-player"
            value={formState.playerId}
            onChange={(event) => formState.onChangePlayerId(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
          >
            <option value="">선수를 선택하세요</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="manual-fine-match"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            관련 경기 · 선택사항
          </label>
          <select
            id="manual-fine-match"
            value={formState.matchId}
            onChange={(event) => formState.onChangeMatchId(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300"
          >
            <option value="">관련 경기 없음</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.date} · {match.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="manual-fine-reason"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            부과 사유
          </label>
          <input
            id="manual-fine-reason"
            value={formState.reason}
            onChange={(event) => formState.onChangeReason(event.target.value)}
            placeholder="예: 공용 장비 미반납"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-orange-300"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={
            !formState.ruleId || !formState.playerId || !formState.reason.trim()
          }
          className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          기타 벌금 부과하기
        </button>
      </div>
    </section>
  );
}
