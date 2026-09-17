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
      className="rounded-xl border border-stone-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(28,25,23,0.3)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            Create Team
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900">
            새 팀 정보
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            팀 이름과 주로 활동하는 종목을 선택해 주세요.
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          팀 관리자
        </span>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="team-name"
            className="mb-2 block text-sm font-bold text-stone-700"
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
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-stone-700">
            기본 종목
          </legend>

          <div className="grid grid-cols-2 gap-3">
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

          <p className="mt-2 text-xs leading-5 text-stone-400">
            경기별 종목과 인원은 이후 일정에서 자유롭게 변경할 수 있어요.
          </p>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={[
          "mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition",
          canSubmit
            ? "bg-stone-900 text-white hover:bg-emerald-600"
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
