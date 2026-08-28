import { useFinanceAutoFine } from "@/hooks/finance/useFinanceAutoFine";
import { formatFinanceEntryDescription } from "@/lib/finance/finance-fine";

import type {
  CreateFineChargeInput,
  FineCharge,
  FineRule,
} from "@/types/finance";
import type { MatchItem } from "@/types/match";
import type { MatchAttendanceByMatchId } from "@/types/match-attendance";
import type { MatchVotesByMatchId } from "@/types/match-vote";
import type { PlayerType } from "@/types/player";

interface FinanceAutoFineSectionProps {
  canManage: boolean;
  fineCharges: FineCharge[];
  matches: MatchItem[];
  players: PlayerType[];
  votes: MatchVotesByMatchId;
  attendance: MatchAttendanceByMatchId;
  fineRules: FineRule[];
  createFineCharges: (inputs: CreateFineChargeInput[]) => Promise<boolean>;
}

export default function FinanceAutoFineSection({
  canManage,
  fineCharges,
  matches,
  players,
  votes,
  attendance,
  fineRules,
  createFineCharges,
}: Readonly<FinanceAutoFineSectionProps>) {
  const {
    selectedMatchId,
    onChangeSelectedMatchId,
    selectableMatches,
    fineTargets,
    isSubmitting,
    handleAutoCharge,
  } = useFinanceAutoFine({
    fineCharges,
    matches,
    players,
    votes,
    attendance,
    fineRules,
    createFineCharges,
  });

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">벌금 관리</h2>
          <p className="mt-2 text-sm text-stone-500">
            출석, 무단불참, 미투표 기준 벌금을 자동으로 부과할 수 있어요.
          </p>
        </div>

        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
          총 {fineCharges.length}건
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label
            htmlFor="fine-match"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            경기 선택
          </label>
          <select
            id="fine-match"
            value={selectedMatchId}
            onChange={(event) => onChangeSelectedMatchId(event.target.value)}
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none focus:border-orange-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          >
            <option value="">경기를 선택하세요</option>
            {selectableMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.date} · {match.title}
              </option>
            ))}
          </select>
        </div>

        {canManage && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAutoCharge}
              disabled={
                !selectedMatchId || fineTargets.length === 0 || isSubmitting
              }
              className="h-12 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isSubmitting ? "부과 중..." : "자동 부과하기"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-semibold text-stone-900">자동 부과 대상</p>

        {!selectedMatchId ? (
          <p className="mt-2 text-sm text-stone-500">
            경기를 선택하면 벌금 대상이 표시돼요.
          </p>
        ) : fineTargets.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            현재 경기에는 자동 부과할 대상이 없어요.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {fineTargets.map((target, index) => (
              <div
                key={`${target.playerId}-${target.trigger}-${index}`}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {target.playerName}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatFinanceEntryDescription(target.description)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-rose-600">
                  +{target.amount.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
