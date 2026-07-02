import type {
  PlayerDetailPosition,
  PlayerPreferredFoot,
  PlayerRole,
  PlayerType,
} from "@/types/player";
import { X } from "lucide-react";
import { useState } from "react";
import PlayerEditSummaryCard from "./PlayerEditSummaryCard";
import PlayerEditNumberSection from "./PlayerEditNumberSection";
import PlayerEditPositionSection from "./PlayerEditPositionSection";
import PlayerEditExtraInfoSection from "./PlayerEditExtraInfoSection";
import PlayerEditRoleSection from "./PlayerEditRoleSection";

interface PlayerEditModalProps {
  player: PlayerType;
  onClose: () => void;
  onSave: (player: PlayerType) => void;
}

export default function PlayerEditModal({
  player,
  onClose,
  onSave,
}: Readonly<PlayerEditModalProps>) {
  const [number, setNumber] = useState(
    player.number ? String(player.number) : "",
  );
  const [detailPositions, setDetailPositions] = useState<
    PlayerDetailPosition[]
  >(player.detailPositions ?? []);
  const [birth, setBirth] = useState(player.birth ?? "");
  const [role, setRole] = useState<PlayerRole>(player.role ?? "member");
  const [preferredFoot, setPreferredFoot] = useState<PlayerPreferredFoot | "">(
    player.preferredFoot ?? "",
  );
  const [note, setNote] = useState(player.note ?? "");

  const handleToggleDetailPosition = (detail: PlayerDetailPosition) => {
    setDetailPositions((prev) =>
      prev.includes(detail)
        ? prev.filter((item) => item !== detail)
        : [...prev, detail],
    );
  };

  const handleSubmit = () => {
    const updatePlayer: PlayerType = {
      ...player,
      number: number ? Number(number) : undefined,
      detailPositions: detailPositions.length > 0 ? detailPositions : undefined,
      birth: birth || undefined,
      role,
      preferredFoot: preferredFoot || undefined,
      note: note.trim() || undefined,
    };
    onSave(updatePlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-5">
          <PlayerEditSummaryCard
            playerName={player.name}
            number={number}
            detailPositions={detailPositions}
            birth={birth}
            appearance={String(player.appearance ?? 0)}
            goal={String(player.goal ?? 0)}
            assist={String(player.assist ?? 0)}
          />
          <PlayerEditNumberSection number={number} onChangeNumber={setNumber} />

          <PlayerEditPositionSection
            detailPositions={detailPositions}
            onToggleDetailPosition={handleToggleDetailPosition}
          />
          <PlayerEditRoleSection role={role} onChangeRole={setRole} />

          <PlayerEditExtraInfoSection
            birth={birth}
            onChangeBirth={setBirth}
            preferredFoot={preferredFoot}
            onChangePreferredFoot={setPreferredFoot}
            note={note}
            onChangeNote={setNote}
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-12 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
