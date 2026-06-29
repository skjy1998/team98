interface PlayerEditExtraInfoSectionProps {
  birth: string;
  onChangeBirth: (value: string) => void;
  appearance: string;
  onChangeAppearance: (value: string) => void;
  goal: string;
  onChangeGoal: (value: string) => void;
  assist: string;
  onChangeAssist: (value: string) => void;
}

export default function PlayerEditExtraInfoSection({
  birth,
  onChangeBirth,
  appearance,
  onChangeAppearance,
  goal,
  onChangeGoal,
  assist,
  onChangeAssist,
}: Readonly<PlayerEditExtraInfoSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">03 추가 정보</p>
        <p className="mt-1 text-sm text-stone-400">
          경기 기록과 기본 프로필을 함께 관리할 수 있어요.
        </p>
      </div>
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
      <div className="grid gap-2 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="player-appearance"
            className="text-sm font-semibold text-stone-700"
          >
            출전
          </label>
          <input
            id="player-appearance"
            type="number"
            value={appearance}
            onChange={(event) => onChangeAppearance(event.target.value)}
            placeholder="0"
            className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="player-goal"
            className="text-sm font-semibold text-stone-700"
          >
            득점
          </label>
          <input
            id="player-goal"
            type="number"
            value={goal}
            onChange={(event) => onChangeGoal(event.target.value)}
            placeholder="0"
            className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="player-assist"
            className="text-sm font-semibold text-stone-700"
          >
            어시스트
          </label>
          <input
            id="player-assist"
            type="number"
            value={assist}
            onChange={(event) => onChangeAssist(event.target.value)}
            placeholder="0"
            className="h-14 w-full rounded-[18px] border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
          />
        </div>
      </div>
    </section>
  );
}
