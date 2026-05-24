import type { PlayerType } from "@/types/player";

interface Props {
  player: PlayerType;
  onClose: () => void;
  onDelete: () => void;
}

export default function PlayerDeleteModal({
  player,
  onClose,
  onDelete,
}: Readonly<Props>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="삭제 모달 닫기"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="relative bg-white w-[400px] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold">선수 삭제</h2>

        <p className="text-sm text-gray-600">
          {player.name} 선수를 삭제하시겠습니까?
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-500"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
