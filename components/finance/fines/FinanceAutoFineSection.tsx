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

function formatAutoFineTargetDescription(description: string) {
  return formatFinanceEntryDescription(description)
    .replace(/^\d{4}-\d{2}-\d{2}\s+/, "")
    .replace(/\s+\([^)]*\)$/, "")
    .replace(/\s+벌금$/, "");
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
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 sm:text-xl">
            벌금 관리
          </h2>
          <p className="mt-1 text-xs text-stone-500 sm:mt-2 sm:text-sm">
            출석, 무단불참, 미투표 기준 벌금을 자동으로 부과할 수 있어요.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 sm:px-3 sm:text-sm">
          총 {fineCharges.length}건
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] sm:mt-5 sm:gap-4">
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
            className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100 sm:h-12 sm:px-4"
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
              className="h-10 w-full rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 sm:h-12 md:w-auto"
            >
              {isSubmitting ? "부과 중..." : "자동 부과하기"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:mt-5 sm:p-4">
        <p className="text-xs font-semibold text-stone-900 sm:text-sm">
          자동 부과 대상
        </p>

        {!selectedMatchId ? (
          <p className="mt-2 text-xs text-stone-500 sm:text-sm">
            경기를 선택하면 벌금 대상이 표시돼요.
          </p>
        ) : fineTargets.length === 0 ? (
          <p className="mt-2 text-xs text-stone-500 sm:text-sm">
            현재 경기에는 자동 부과할 대상이 없어요.
          </p>
        ) : (
          <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
            {fineTargets.map((target, index) => (
              <div
                key={`${target.playerId}-${target.trigger}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 sm:px-4 sm:py-3"
              >
                <div>
                  <p className="truncate text-sm font-semibold text-stone-900">
                    {target.playerName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-stone-500 sm:mt-1">
                    {formatAutoFineTargetDescription(target.description)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-rose-600">
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
