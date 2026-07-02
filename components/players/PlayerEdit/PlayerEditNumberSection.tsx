interface PlayerEditNumberSectionProps {
  number: string;
  onChangeNumber: (value: string) => void;
}

export default function PlayerEditNumberSection({
  number,
  onChangeNumber,
}: Readonly<PlayerEditNumberSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">01 등번호</p>
        <p className="mt-1 text-sm text-stone-400">
          비워두면 아직 배정되지 않은 선수로 저장돼요.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="player-number"
            className="text-sm font-semibold text-stone-700"
          >
            등번호
          </label>
          <input
            id="player-number"
            type="number"
            min={0}
            value={number}
            onChange={(event) => onChangeNumber(event.target.value)}
            placeholder="17"
            className="h-14 w-full rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-emerald-300"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-stone-700">미리보기</p>
          <div className="flex h-14 items-center rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-stone-500">
            {number ? `#${number}` : "미배정"}
          </div>
        </div>
      </div>
    </section>
  );
}
