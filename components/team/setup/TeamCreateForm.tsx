import type { TeamSport } from "@/types/team";
import TeamSportOption from "./TeamSportOption";

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
    <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-stone-900">새 팀 만들기</h3>
        <p className="text-sm text-stone-500">
          팀 이름과 기본 정보를 입력해 팀을 생성해요.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="team-name"
            className="mb-2 block text-sm font-medium text-stone-900"
          >
            팀 이름
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(event) => onChangeTeamName(event.target.value)}
            placeholder="우리 팀의 이름"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-stone-900">종목</p>
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
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onCreateTeam}
          disabled={!canSubmit}
          className={[
            "flex h-14 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
            canSubmit
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-stone-100 text-stone-400",
          ].join(" ")}
        >
          {isSubmitting ? "팀 생성 중..." : "팀 만들고 시작하기"}
        </button>
      </div>
    </section>
  );
}
