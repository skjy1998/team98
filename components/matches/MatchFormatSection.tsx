import type { MatchPlayersPerSide } from "@/types/match";
import type { TeamSport } from "@/types/team";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface MatchFormatSectionProps {
  sport: TeamSport;
  playersPerSide: MatchPlayersPerSide;
  onChangePlayersPerSide: (value: MatchPlayersPerSide) => void;
  quarterCount: number;
  onChangeQuarterCount: (value: number) => void;
  quarterDurationMinutes: number;
  onChangeQuarterDurationMinutes: (value: number) => void;
}

const playerCountOptions: Record<TeamSport, readonly MatchPlayersPerSide[]> = {
  soccer: [11],
  futsal: [3, 4, 5, 6, 7],
};

export default function MatchFormatSection({
  sport,
  playersPerSide,
  onChangePlayersPerSide,
  quarterCount,
  onChangeQuarterCount,
  quarterDurationMinutes,
  onChangeQuarterDurationMinutes,
}: Readonly<MatchFormatSectionProps>) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-stone-700">경기 구성</h3>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          필수
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SelectField label="참가 인원">
          <select
            value={playersPerSide}
            onChange={(event) =>
              onChangePlayersPerSide(
                Number(event.target.value) as MatchPlayersPerSide,
              )
            }
            className="h-12 w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 pr-10 text-sm font-semibold text-stone-800 outline-none transition focus:border-emerald-300"
          >
            {playerCountOptions[sport].map((count) => (
              <option key={count} value={count}>
                {count}대{count}
              </option>
            ))}
          </select>
        </SelectField>

        <SelectField label="쿼터 수" showChevron={false}>
          <input
            type="number"
            min={1}
            step={1}
            value={quarterCount || ""}
            onChange={(event) => {
              if (event.target.value === "") {
                onChangeQuarterCount(0);
                return;
              }

              const nextValue = event.target.valueAsNumber;

              if (Number.isFinite(nextValue)) {
                onChangeQuarterCount(Math.floor(nextValue));
              }
            }}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-800 outline-none transition focus:border-emerald-300"
            aria-label="쿼터 수"
          />
        </SelectField>

        <SelectField label="쿼터 시간" showChevron={false}>
          <div className="relative">
            <input
              type="number"
              min={5}
              max={60}
              step={1}
              value={quarterDurationMinutes || ""}
              onChange={(event) => {
                if (event.target.value === "") {
                  onChangeQuarterDurationMinutes(0);
                  return;
                }

                const nextValue = event.target.valueAsNumber;

                if (Number.isFinite(nextValue)) {
                  onChangeQuarterDurationMinutes(Math.floor(nextValue));
                }
              }}
              className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 pr-12 text-sm font-semibold text-stone-800 outline-none transition focus:border-emerald-300"
              aria-label="쿼터 시간"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400">
              분
            </span>
          </div>
        </SelectField>
      </div>

      {sport === "soccer" && (
        <p className="mt-2 text-xs text-stone-400">
          축구 경기는 현재 11대11 포메이션을 지원해요.
        </p>
      )}
    </section>
  );
}

interface SelectFieldProps {
  label: string;
  children: ReactNode;
  showChevron?: boolean;
}

function SelectField({
  label,
  children,
  showChevron = true,
}: Readonly<SelectFieldProps>) {
  return (
    <label className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
      <span className="mb-2 block text-xs font-medium text-stone-400">
        {label}
      </span>

      <div className="relative">
        {children}

        {showChevron && (
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        )}
      </div>
    </label>
  );
}
