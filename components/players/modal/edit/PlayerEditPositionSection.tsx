import type { PlayerDetailPosition } from "@/types/player";
import PlayerPositionSelector from "../../PlayerPositionSelector";

interface PlayerEditPositionSectionProps {
  detailPositions: PlayerDetailPosition[];
  onToggleDetailPosition: (detail: PlayerDetailPosition) => void;
}

export default function PlayerEditPositionSection({
  detailPositions,
  onToggleDetailPosition,
}: Readonly<PlayerEditPositionSectionProps>) {
  return (
    <section className="rounded-xl border border-stone-200 p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">02 선호 포지션</p>
        <p className="mt-1 text-sm text-stone-400">
          라인업·교체 추천에 반영돼요. 복수 선택 가능.
        </p>
      </div>

      <PlayerPositionSelector
        detailPositions={detailPositions}
        onTogglePosition={onToggleDetailPosition}
      />
    </section>
  );
}
