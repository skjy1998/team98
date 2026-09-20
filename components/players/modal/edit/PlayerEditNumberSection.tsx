interface PlayerEditNumberSectionProps {
  number: string;
  onChangeNumber: (value: string) => void;
}

export default function PlayerEditNumberSection({
  number,
  onChangeNumber,
}: Readonly<PlayerEditNumberSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-3.5 sm:p-5">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs font-semibold text-emerald-600 sm:text-sm">
          01 등번호
        </p>
        <p className="mt-1 text-xs text-stone-400 sm:text-sm">
          비워두면 아직 배정되지 않은 선수로 저장돼요.
        </p>
      </div>

      <div className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-2.5 sm:gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="player-number"
            className="text-xs font-semibold leading-5 text-stone-700 sm:text-sm"
          >
            등번호
          </label>
          <input
            id="player-number"
            type="number"
            min={0}
            value={number}
            onChange={(event) => onChangeNumber(event.target.value)}
            placeholder="-"
            className="h-11 w-full appearance-none rounded-xl border border-stone-200 px-3 text-center text-sm font-semibold text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-emerald-300 sm:h-14 sm:w-full sm:px-4 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold leading-5 text-stone-700 sm:text-sm">
            미리보기
          </p>
          <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-500 sm:h-14 sm:px-4">
            {number ? `#${number}` : "미배정"}
          </div>
        </div>
      </div>
    </section>
  );
}
