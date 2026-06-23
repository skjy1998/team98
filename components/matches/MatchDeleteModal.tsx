import type { MatchItem } from "@/types/match";

interface MatchDeleteModalProps {
  match: MatchItem;
  onClose: () => void;
  onDelete: () => void;
}

export default function MatchDeleteModal({
  match,
  onClose,
  onDelete,
}: Readonly<MatchDeleteModalProps>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-stone-900">경기 삭제</h2>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          <span className="font-medium text-stone-800">{match.title}</span>{" "}
          경기를 삭제할까요?
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          연결된 기록과 출석 데이터도 함께 삭제됩니다.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
