import type { MatchItem } from "@/types/match";
import { Trash2 } from "lucide-react";

interface MatchInfoDisplayProps {
  match: MatchItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MatchInfoDisplay({
  match,
  onEdit,
  onDelete,
}: Readonly<MatchInfoDisplayProps>) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-900">경기 정보</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
            aria-label="경기 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm text-stone-400">경기 유형</p>
          <p className="mt-2 text-base font-semibold text-stone-900">
            {match.type}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm text-stone-400">날짜</p>
          <p className="mt-2 text-base font-semibold text-stone-900">
            {match.date}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm text-stone-400">시작 시간</p>
          <p className="mt-2 text-base font-semibold text-stone-900">
            {match.startTime}
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
          <p className="text-sm text-stone-400">종료 시간</p>
          <p className="mt-2 text-base font-semibold text-stone-900">
            {match.endTime}
          </p>
        </div>
      </div>
    </section>
  );
}
