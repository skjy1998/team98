import type { TeamSport } from "@/types/team";
import TeamSportOption from "./TeamSportOption";
import { LoaderCircle } from "lucide-react";

interface TeamCreateFormProps {
  teamName: string;
  teamSport: TeamSport;
  isSubmitting: boolean;
  onChangeTeamName: (value: string) => void;
  onChangeTeamSport: (sport: TeamSport) => void;
  onCreateTeam: () => void | Promise<void>;
}

export default function TeamCreateForm({
  teamName,
  teamSport,
  isSubmitting,
  onChangeTeamName,
  onChangeTeamSport,
  onCreateTeam,
}: Readonly<TeamCreateFormProps>) {
  const canSubmit = Boolean(teamName.trim()) && !isSubmitting;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onCreateTeam();
      }}
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-[0_24px_70px_-40px_rgba(28,25,23,0.3)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-xs">
            Create Team
          </p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-stone-900 sm:mt-2 sm:text-2xl">
            새 팀 정보
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-stone-500 sm:mt-2 sm:text-sm sm:leading-6">
            팀 이름과 주로 활동하는 종목을 선택해 주세요.
          </p>
        </div>

        <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:px-3 sm:py-1.5 sm:text-xs">
          팀 관리자
        </span>
      </div>

      <div className="mt-5 space-y-5 sm:mt-8 sm:space-y-6">
        <div>
          <label
            htmlFor="team-name"
            className="mb-1.5 block text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm"
          >
            팀 이름
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(event) => onChangeTeamName(event.target.value)}
            placeholder="예: SquadFlow FC"
            disabled={isSubmitting}
            autoComplete="organization"
            className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-xs text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:px-4 sm:text-sm"
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-bold text-stone-700 sm:mb-2 sm:text-sm">
            기본 종목
          </legend>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <TeamSportOption
              sport="soccer"
              selected={teamSport === "soccer"}
              disabled={isSubmitting}
              onSelect={onChangeTeamSport}
            />

            <TeamSportOption
              sport="futsal"
              selected={teamSport === "futsal"}
              disabled={isSubmitting}
              onSelect={onChangeTeamSport}
            />
          </div>

          <p className="mt-2 text-[11px] leading-5 text-stone-400 sm:text-xs">
            경기별 종목과 인원은 이후 일정에서 자유롭게 변경할 수 있어요.
          </p>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          "mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition sm:mt-8 sm:h-12 sm:text-sm",
          canSubmit
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "cursor-not-allowed bg-stone-100 text-stone-400",
        ].join(" ")}
      >
        {isSubmitting && (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        )}
        {isSubmitting ? "팀 생성 중..." : "팀 만들고 시작하기"}
      </button>
    </form>
  );
}
