import type { PlayerPreferredFoot } from "@/types/player";

interface PlayerEditExtraInfoSectionProps {
  birth: string;
  onChangeBirth: (value: string) => void;
  preferredFoot: PlayerPreferredFoot;
  onChangePreferredFoot: (value: PlayerPreferredFoot) => void;
  note: string;
  onChangeNote: (value: string) => void;
}

const preferredFootOptions: {
  value: PlayerPreferredFoot;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "right",
    label: "오른발",
    activeClassName: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  {
    value: "left",
    label: "왼발",
    activeClassName: "border-sky-300 bg-sky-50 text-sky-700",
  },
  {
    value: "both",
    label: "양발",
    activeClassName: "border-amber-300 bg-amber-50 text-amber-700",
  },
];

export default function PlayerEditExtraInfoSection({
  birth,
  onChangeBirth,
  preferredFoot,
  onChangePreferredFoot,
  note,
  onChangeNote,
}: Readonly<PlayerEditExtraInfoSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">06 추가 정보</p>
        <p className="mt-1 text-sm text-stone-400">
          선수 기본 프로필을 관리할 수 있어요.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="player-birth"
            className="text-sm font-semibold text-stone-700"
          >
            생년월일
          </label>
          <input
            id="player-birth"
            type="date"
            value={birth}
            onChange={(event) => onChangeBirth(event.target.value)}
            className="h-14 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition focus:border-emerald-300"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-stone-700">주발</p>

          <div className="grid gap-2 md:grid-cols-3">
            {preferredFootOptions.map((option) => {
              const isActive = preferredFoot === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChangePreferredFoot(option.value)}
                  className={[
                    "flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition",
                    isActive
                      ? option.activeClassName
                      : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="player-note"
            className="text-sm font-semibold text-stone-700"
          >
            메모
          </label>
          <textarea
            id="player-note"
            value={note}
            onChange={(event) => onChangeNote(event.target.value)}
            placeholder="예: 선호 포지션 보조 가능, 주말 위주 참석, 수비 조율 강점"
            rows={4}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
          />
        </div>
      </div>
    </section>
  );
}
