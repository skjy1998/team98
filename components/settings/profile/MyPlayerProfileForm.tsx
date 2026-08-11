import PlayerPositionSelector from "@/components/players/PlayerPositionSelector";
import type { PlayerDetailPosition } from "@/types/player";
import type { ProfilePlayerSettings } from "@/types/settings";
import { useState } from "react";

interface MyPlayerProfileFormProps {
  player: ProfilePlayerSettings;
  onSave: (
    playerId: string,
    number: number | undefined,
    detailPositions: PlayerDetailPosition[],
  ) => Promise<boolean>;
}

export default function MyPlayerProfileForm({
  player,
  onSave,
}: Readonly<MyPlayerProfileFormProps>) {
  const [number, setNumber] = useState(
    player.number !== undefined ? String(player.number) : "",
  );
  const [detailPositions, setDetailPositions] = useState<
    PlayerDetailPosition[]
  >(player.detailPositions);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTogglePosition = (position: PlayerDetailPosition) => {
    setDetailPositions((current) =>
      current.includes(position)
        ? current.filter((item) => item !== position)
        : [...current, position],
    );
  };

  const handleSave = async () => {
    const parsedNumber = number.trim() === "" ? undefined : Number(number);

    setSuccessMessage("");
    setIsSaving(true);

    const success = await onSave(player.id, parsedNumber, detailPositions);

    setIsSaving(false);

    if (success) {
      setSuccessMessage("선수 정보가 변경됐어요.");
    }
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">내 선수 정보</h2>
        <p className="mt-1 text-sm text-stone-400">
          등번호와 선호 포지션을 관리할 수 있어요.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="profile-player-number"
            className="mb-2 block text-sm font-medium text-stone-600"
          >
            등번호
          </label>
          <input
            id="profile-player-number"
            type="number"
            min={0}
            value={number}
            disabled={isSaving}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="미배정"
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-stone-100"
          />
          <p className="mt-2 text-xs text-stone-400">
            비워두면 미배정으로 저장돼요.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium text-stone-600">선호 포지션</p>
          <PlayerPositionSelector
            detailPositions={detailPositions}
            onTogglePosition={handleTogglePosition}
            disabled={isSaving}
          />
        </div>
        {successMessage && (
          <p className="text-sm font-medium text-emerald-600">
            {successMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "선수 정보 저장"}
          </button>
        </div>
      </div>
    </section>
  );
}
