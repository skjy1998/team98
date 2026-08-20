import { formatMatchDate } from "@/lib/matches/match-ui";
import { formatVoteDeadline } from "@/lib/matches/match-vote";
import type { MatchItem } from "@/types/match";
import { Pencil, Trash2 } from "lucide-react";

interface MatchInfoDisplayProps {
  match: MatchItem;
  onEdit: () => void;
  onDelete: () => void;
  canManage: boolean;
}

export default function MatchInfoDisplay({
  match,
  onEdit,
  onDelete,
  canManage,
}: Readonly<MatchInfoDisplayProps>) {
  const infoItems = [
    { label: "경기 종목", value: match.sport === "futsal" ? "풋살" : "축구" },
    { label: "경기 유형", value: match.type },
    { label: "날짜", value: formatMatchDate(match.date) },
    { label: "경기 시간", value: `${match.startTime} - ${match.endTime}` },
    { label: "투표 마감", value: formatVoteDeadline(match.voteDeadline) },
    { label: "장소", value: match.location || "장소 미정" },
  ];

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-stone-900">경기 정보</h2>
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              aria-label="경기 정보 수정"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-100"
            >
              <Pencil className="h-4 w-4" />
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
        )}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-stone-200 bg-stone-50/70 p-4"
          >
            <p className="text-sm text-stone-400">{item.label}</p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
