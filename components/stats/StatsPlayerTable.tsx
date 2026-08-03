import type { StatsSortKey, StatsPlayerRow } from "@/types/stats";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

const sortableColumns: {
  key: StatsSortKey;
  label: string;
  activeClassName: string;
}[] = [
  {
    key: "attackPoint",
    label: "G+A",
    activeClassName: "font-semibold text-orange-500",
  },
  {
    key: "goal",
    label: "골",
    activeClassName: "font-semibold text-emerald-600",
  },
  {
    key: "assist",
    label: "어시",
    activeClassName: "font-semibold text-sky-600",
  },
  {
    key: "appearance",
    label: "출전",
    activeClassName: "font-semibold text-amber-600",
  },
  {
    key: "attendanceRate",
    label: "출석률",
    activeClassName: "font-semibold text-orange-500",
  },
];

interface StatsSortButtonProps {
  column: {
    key: StatsSortKey;
    label: string;
    activeClassName: string;
  };
  sortKey: StatsSortKey;
  isAscending: boolean;
  onSort: (key: StatsSortKey) => void;
}

function StatsSortButton({
  column,
  sortKey,
  isAscending,
  onSort,
}: Readonly<StatsSortButtonProps>) {
  const isActive = sortKey === column.key;

  return (
    <button
      type="button"
      onClick={() => onSort(column.key)}
      className={`inline-flex items-center gap-1 transition ${
        isActive
          ? column.activeClassName
          : "font-medium text-stone-400 hover:text-stone-600"
      }`}
      aria-label={`${column.label} 기준 ${
        isActive && !isAscending ? "오름차순" : "내림차순"
      } 정렬`}
    >
      <span>{column.label}</span>
      {isActive ? (
        isAscending ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
    </button>
  );
}

function getPlayerRank(
  players: StatsPlayerRow[],
  player: StatsPlayerRow,
  sortKey: StatsSortKey,
) {
  const playerValue = player[sortKey];

  if (playerValue === 0) return null;

  const higherPlayerCount = players.filter(
    (item) => item[sortKey] > playerValue,
  ).length;

  return higherPlayerCount + 1;
}

interface StatsPlayerTableProps {
  players: StatsPlayerRow[];
}

export default function StatsPlayerTable({
  players,
}: Readonly<StatsPlayerTableProps>) {
  const [sortKey, setSortKey] = useState<StatsSortKey>("attackPoint");
  const [isAscending, setIsAscending] = useState(false);

  const handleSort = (key: StatsSortKey) => {
    if (sortKey === key) {
      setIsAscending((prev) => !prev);
      return;
    }
    setSortKey(key);
    setIsAscending(false);
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const direction = isAscending ? 1 : -1;

      if (a[sortKey] !== b[sortKey]) {
        return a[sortKey] > b[sortKey] ? direction : -direction;
      }

      return a.name.localeCompare(b.name, "ko");
    });
  }, [players, sortKey, isAscending]);
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900">
            전체 선수 기록
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            선수별 출전, 득점, 어시스트 기록을 확인하세요.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">
            선수별 공격포인트, 득점, 도움, 출전 및 출석률 순위
          </caption>
          <thead>
            <tr className="text-stone-400">
              <th className="border-b border-stone-200 px-4 py-3 text-left font-medium">
                순위
              </th>
              <th className="border-b border-stone-200 px-4 py-3 text-left font-medium">
                이름
              </th>
              {sortableColumns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-stone-200 px-4 py-3 text-right font-medium"
                >
                  <StatsSortButton
                    column={column}
                    sortKey={sortKey}
                    isAscending={isAscending}
                    onSort={handleSort}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-stone-400"
                >
                  표시할 선수 기록이 없어요.
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player) => {
                const rank = getPlayerRank(players, player, sortKey);
                const isLeader = rank === 1;

                return (
                  <tr
                    key={player.id}
                    className={isLeader ? "bg-orange-50/50" : "bg-white"}
                  >
                    <td
                      className={`border-b border-stone-100 px-4 py-4 text-left ${
                        rank !== null && rank <= 3
                          ? "font-bold text-orange-500"
                          : "font-semibold text-stone-500"
                      }`}
                    >
                      {rank ?? "-"}
                    </td>

                    <td className="border-b border-stone-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        {player.number !== undefined ? (
                          <span className="text-orange-500">
                            #{player.number}
                          </span>
                        ) : null}
                        <span className="font-medium text-stone-900">
                          {player.name}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-stone-100 px-4 py-4 text-right text-2xl font-semibold text-orange-500">
                      {player.attackPoint}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-emerald-600">
                      {player.goal}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-sky-600">
                      {player.assist}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-stone-700">
                      {player.appearance}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-orange-500">
                      {player.attendanceRate}%
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
