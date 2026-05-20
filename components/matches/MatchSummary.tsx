import { MatchType } from "@/types/match";

interface MatchSummaryProps {
  match: MatchType;
}

export default function MatchSummary({ match }: Readonly<MatchSummaryProps>) {
  const result =
    Number(match.ourScore) > Number(match.opponentScore)
      ? "승리"
      : Number(match.ourScore) < Number(match.opponentScore)
        ? "패배"
        : "무승부";
  const resultClass =
    result === "승리"
      ? "bg-green-100 text-green-600"
      : result === "패배"
        ? "bg-red-100 text-red-500"
        : "bg-gray-100 text-gray-500";

  return (
    <>
      <div className="text-center text-sm text-gray-500">
        {match.date} {match.time} | {match.location}
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
          <div className="flex items-center justify-end gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 font-black">
              FC
            </div>
            <h2 className="text-lg font-bold">FC United</h2>
          </div>

          <div className="text-center">
            {match.status === "종료" ? (
              <div className="text-5xl font-black tracking-tight whitespace-nowrap">
                {match.ourScore} : {match.opponentScore}
              </div>
            ) : (
              <div className="text-3xl font-black text-gray-400">VS</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">{match.opponent}</h2>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-black">
              {match.opponent.slice(0, 2)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          {match.status === "종료" ? (
            <div
              className={`w-fit rounded-md px-3 py-1 text-sm font-bold ${resultClass}`}
            >
              {Number(match.ourScore) > Number(match.opponentScore)
                ? "승리"
                : Number(match.ourScore) < Number(match.opponentScore)
                  ? "패배"
                  : "무승부"}
            </div>
          ) : (
            <div className="w-fit rounded-md bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500">
              예정 경기
            </div>
          )}
        </div>
      </div>
    </>
  );
}
