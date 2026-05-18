import { MatchType } from "@/types/match";
import { useState } from "react";

interface MatchScheduleListProps {
  matches: MatchType[];
  selectedMatchId: string | null;
  onSelect: (matchId: string) => void;
  onDelete: (matchId: string) => void;
  onAddOpen: () => void;
}

export default function MatchScheduleList({
  matches,
  selectedMatchId,
  onSelect,
  onDelete,
  onAddOpen,
}: Readonly<MatchScheduleListProps>) {
  const [filter, setFilter] = useState<"전체" | "홈" | "원정">("전체");
  const filteredMatches = matches.filter((match) => {
    if (filter === "전체") return true;
    return match.venue === filter;
  });
  return (
    <div className="rounded-xl border bg-white p-4">
      {/* 경기일정 제목 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">경기 일정</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "전체" | "홈" | "원정")}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="전체">전체</option>
          <option value="홈">홈</option>
          <option value="원정">원정</option>
        </select>
      </div>
      {/* 일정 나열 */}
      <div className="space-y-3">
        <div className="max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1">
          {filteredMatches.map((match) => {
            const isActive = match.id === selectedMatchId;

            return (
              <div
                key={match.id}
                className={`relative rounded-xl border transition ${
                  isActive
                    ? "border-green-500 bg-green-50"
                    : "border-gray-100 bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(match.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {match.date} {match.time}
                      </p>
                      <p className="mt-1 font-bold">vs {match.opponent}</p>
                      <p className="text-sm text-gray-500">{match.location}</p>
                    </div>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-bold ${
                        match.venue === "홈"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {match.venue}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  aria-label="일정 삭제"
                  onClick={() => onDelete(match.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onAddOpen}
          className="mt-4 w-full rounded-lg border py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
        >
          + 일정 추가
        </button>
      </div>
    </div>
  );
}
