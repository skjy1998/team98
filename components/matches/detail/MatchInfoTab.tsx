import { MatchResultStatus } from "@/lib/match-ui";
import { MatchItem } from "@/types/match";

interface MatchInfoTab {
  match: MatchItem;
  result: MatchResultStatus;
}

export function MatchInfoTab({ match, result }: Readonly<MatchInfoTab>) {
  const resultLabel =
    result === "win"
      ? "승리"
      : result === "lose"
        ? "패배"
        : result === "draw"
          ? "무승부"
          : result === "canceled"
            ? "취소"
            : match.isUpcoming
              ? "예정"
              : "기록 전";
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">경기 정보</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">경기 유형</p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {match.type}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">경기 결과</p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {resultLabel}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">경기 일정</p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {match.date} · {match.startTime}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <p className="text-sm text-stone-400">장소</p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {match.location}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">메모</h2>
        <p className="mt-4 text-sm leading-7 text-stone-500">
          경기 관련 상세 정보
        </p>
      </section>
    </div>
  );
}
