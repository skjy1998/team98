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
    activeClassName: "font-semibold text-emerald-600",
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
    key: "mvpCount",
    label: "MVP",
    activeClassName: "font-semibold text-amber-600",
  },
  {
    key: "appearance",
    label: "출전",
    activeClassName: "font-semibold text-amber-600",
  },
  {
    key: "attendanceRate",
    label: "출석률",
    activeClassName: "font-semibold text-stone-700",
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
  currentPlayerId?: string;
}

export default function StatsPlayerTable({
  players,
  currentPlayerId,
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
    <section className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 sm:text-2xl">
            전체 선수 기록
          </h2>
          <p className="mt-1 text-xs text-stone-400 sm:mt-2 sm:text-sm">
            선수별 득점, 어시스트, MVP 및 출전 기록을 확인하세요.
          </p>
        </div>
      </div>

      <div className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 md:hidden">
        {sortableColumns.map((column) => {
          const isActive = sortKey === column.key;

          return (
            <button
              key={column.key}
              type="button"
              onClick={() => handleSort(column.key)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-stone-200 bg-white text-stone-500"
              }`}
            >
              {column.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 space-y-3 md:hidden">
        {sortedPlayers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 py-10 text-center text-xs text-stone-400">
            표시할 선수 기록이 없어요.
          </div>
        ) : (
          sortedPlayers.map((player) => {
            const rank = getPlayerRank(players, player, sortKey);
            const isCurrentPlayer = player.id === currentPlayerId;

            return (
              <article
                key={player.id}
                className={`rounded-2xl border p-4 transition ${
                  isCurrentPlayer
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-stone-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`w-4 shrink-0 text-center text-sm font-bold ${
                        isCurrentPlayer ? "text-emerald-600" : "text-stone-500"
                      }`}
                    >
                      {rank ?? "-"}
                    </span>

                    {player.number !== undefined && (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-1 text-xs font-bold text-emerald-700">
                        #{player.number}
                      </span>
                    )}

                    <p className="truncate text-base font-semibold text-stone-900">
                      {player.name}
                    </p>
                  </div>

                  <span className="shrink-0 text-base font-bold text-emerald-700">
                    G+A {player.attackPoint}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-1.5">
                  {[
                    {
                      label: "골",
                      value: player.goal,
                      className: "text-emerald-600",
                    },
                    {
                      label: "도움",
                      value: player.assist,
                      className: "text-sky-600",
                    },
                    {
                      label: "MVP",
                      value: player.mvpCount,
                      className: "text-amber-600",
                    },
                    {
                      label: "출석",
                      value: `${player.attendanceRate}%`,
                      className: "text-stone-700",
                    },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-xs text-stone-400">{item.label}</p>
                      <p
                        className={`mt-1 text-base font-bold ${item.className}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">
            선수별 공격포인트, 득점, 도움, MVP, 출전 및 출석률 순위
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
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-stone-400"
                >
                  표시할 선수 기록이 없어요.
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player) => {
                const rank = getPlayerRank(players, player, sortKey);
                const isCurrentPlayer = player.id === currentPlayerId;

                return (
                  <tr
                    key={player.id}
                    className={
                      isCurrentPlayer ? "bg-emerald-50/50" : "bg-white"
                    }
                  >
                    <td
                      className={`border-b border-stone-100 px-4 py-4 text-left ${
                        rank === 1
                          ? "font-bold text-emerald-600"
                          : rank === 2
                            ? "font-bold text-stone-600"
                            : rank === 3
                              ? "font-bold text-amber-600"
                              : "font-semibold text-stone-500"
                      }`}
                    >
                      {rank ?? "-"}
                    </td>

                    <td className="border-b border-stone-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        {player.number !== undefined ? (
                          <span className="text-emerald-500">
                            #{player.number}
                          </span>
                        ) : null}
                        <span className="font-medium text-stone-900">
                          {player.name}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-stone-100 px-4 py-4 text-right text-2xl font-semibold text-emerald-500">
                      {player.attackPoint}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-emerald-600">
                      {player.goal}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-sky-600">
                      {player.assist}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-amber-600">
                      {player.mvpCount}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-stone-700">
                      {player.appearance}
                    </td>
                    <td className="border-b border-stone-100 px-4 py-4 text-right text-xl font-medium text-stone-700">
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
