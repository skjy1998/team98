import type { PlayerType } from "@/types/player";

interface PlayerDeleteModalProps {
  player: PlayerType;
  onClose: () => void;
  onDelete: () => void;
}

export default function PlayerDeleteModal({
  player,
  onClose,
  onDelete,
}: Readonly<PlayerDeleteModalProps>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <button
        type="button"
        aria-label="삭제 모달 닫기"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl md:p-7">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-rose-500">선수 삭제</p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
            {player.name} 선수를 삭제할까요?
          </h2>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            삭제 후에는 되돌릴 수 없어요.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-500 transition hover:bg-stone-50"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="h-12 flex-1 rounded-xl bg-rose-500 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
