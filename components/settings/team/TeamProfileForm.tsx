import { useToastStore } from "@/stores/toast-store";
import type { CurrentTeam, TeamSport } from "@/types/team";
import { useState } from "react";

interface TeamProfileFormProps {
  team: CurrentTeam;
  canManage: boolean;
  onSave: (name: string, sport: TeamSport) => Promise<boolean>;
}

const sportOptions: Array<{
  value: TeamSport;
  label: string;
  description: string;
}> = [
  {
    value: "soccer",
    label: "축구",
    description: "11인제 축구팀",
  },
  {
    value: "futsal",
    label: "풋살",
    description: "소규모 풋살팀",
  },
];

export default function TeamProfileForm({
  team,
  canManage,
  onSave,
}: Readonly<TeamProfileFormProps>) {
  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState(team.name);
  const [sport, setSport] = useState<TeamSport>(team.sport);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = name.trim() !== team.name || sport !== team.sport;

  const handleSave = async () => {
    setIsSaving(true);

    const success = await onSave(name, sport);

    setIsSaving(false);

    if (!success) {
      showToast("팀 정보 저장에 실패했어요.", "error");
      return;
    }

    showToast("팀 정보가 변경됐어요.", "success");
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">팀 기본 정보</h2>
        <p className="mt-1 text-sm text-stone-400">
          팀 이름과 운영 종목을 설정할 수 있어요.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="team-settings-name"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            팀명
          </label>
          <input
            id="team-settings-name"
            type="text"
            value={name}
            disabled={!canManage || isSaving}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
        </div>
        <fieldset disabled={!canManage || isSaving}>
          <legend className="mb-2 text-sm font-medium text-stone-600">
            종목
          </legend>

          <div className="grid gap-3 md:grid-cols-2">
            {sportOptions.map((option) => {
              const isSelected = sport === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSport(option.value)}
                  className={[
                    "rounded-xl border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                    isSelected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-sm font-semibold",
                      isSelected ? "text-emerald-700" : "text-stone-800",
                    ].join(" ")}
                  >
                    {option.label}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        {!canManage && (
          <p className="text-sm text-stone-400">
            회장과 운영진만 팀 정보를 변경할 수 있어요.
          </p>
        )}

        {canManage && (
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSaving || !name.trim() || !hasChanges}
              onClick={handleSave}
              className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "저장 중..." : "팀 정보 저장"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
