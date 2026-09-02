import type { TeamSport } from "@/types/team";
import { LayoutGrid } from "lucide-react";
import { FaFutbol } from "react-icons/fa6";

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
            <button
              type="button"
              onClick={() => onChangeTeamSport("soccer")}
              disabled={isSubmitting}
              aria-pressed={teamSport === "soccer"}
              className={[
                "rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                teamSport === "soccer"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-stone-200 bg-white hover:bg-stone-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    teamSport === "soccer"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-stone-100 text-stone-400",
                  ].join(" ")}
                >
                  <FaFutbol className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span
                    className={[
                      "block text-sm font-semibold",
                      teamSport === "soccer"
                        ? "text-emerald-700"
                        : "text-stone-900",
                    ].join(" ")}
                  >
                    축구
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-500">
                    정규 축구 경기 기준으로 팀을 운영해요.
                  </span>
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeTeamSport("futsal")}
              disabled={isSubmitting}
              aria-pressed={teamSport === "futsal"}
              className={[
                "rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                teamSport === "futsal"
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-stone-200 bg-white hover:bg-stone-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    teamSport === "futsal"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-stone-100 text-stone-400",
                  ].join(" ")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span
                    className={[
                      "block text-sm font-semibold",
                      teamSport === "futsal"
                        ? "text-emerald-700"
                        : "text-stone-900",
                    ].join(" ")}
                  >
                    풋살
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-500">
                    소규모 인원 중심으로 팀을 운영해요.
                  </span>
                </span>
              </div>
            </button>
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
