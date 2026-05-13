import type { Playertype } from "@/types/player";

interface PlayerTableProps {
  players: Playertype[];
  onEdit: (player: Playertype) => void;
  onDelete: (player: Playertype) => void;
}

export default function PlayerTable({
  players,
  onEdit,
  onDelete,
}: Readonly<PlayerTableProps>) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-5">이름</th>
            <th className="text-left px-4 py-5">등번호</th>
            <th className="text-left px-4 py-5">포지션</th>
            <th className="text-left px-4 py-5">생년월일</th>
            <th className="text-left px-4 py-5">출전</th>
            <th className="text-left px-4 py-5">득점</th>
            <th className="text-right px-4 py-5">액션</th>
          </tr>
        </thead>

        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-5 font-medium">{player.name}</td>
              <td className="px-4 py-5 text-gray-500">{player.number}</td>
              <td className="px-4 py-5 text-gray-500">{player.position}</td>
              <td className="px-4 py-5 text-gray-500">{player.birth}</td>
              <td className="px-4 py-5 text-gray-500">{player.appearance}</td>
              <td className="px-4 py-5 text-gray-500">{player.goal}</td>
              <td className="px-4 py-4 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(player)}
                  className="text-blue-500 hover:underline"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(player)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
