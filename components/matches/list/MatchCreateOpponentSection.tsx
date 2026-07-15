import type { MatchType } from "@/types/match";
import { Users } from "lucide-react";

interface MatchCreateOpponentSectionProps {
  type: MatchType;
  opponent: string;
  onChangeOpponent: (value: string) => void;
}

export default function MatchCreateOpponentSection({
  type,
  opponent,
  onChangeOpponent,
}: Readonly<MatchCreateOpponentSectionProps>) {
  if (type !== "정규") {
    return null;
  }

  return (
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

      <div className="relative">
        <Users className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-300" />
        <input
          id="match-opponent"
          value={opponent}
          onChange={(event) => onChangeOpponent(event.target.value)}
          placeholder="상대 팀 이름을 입력하세요."
          className="h-16 w-full rounded-xl border border-stone-200 bg-white px-5 text-lg text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
        />
      </div>
    </section>
  );
}
