import { MatchLineup } from "@/types/match";
import FormationBoard from "../tactics/FormationBoard";
import { Playertype } from "@/types/player";

interface MatchLineupTabProps {
  lineup: MatchLineup | undefined;
  players: Playertype[];
  onLineupOpen: () => void;
}

export default function MatchLineupTab({
  lineup,
  players,
  onLineupOpen,
}: Readonly<MatchLineupTabProps>) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">선발 라인업</h3>
        <button
          type="button"
          onClick={onLineupOpen}
          className="rounded-lg bg-green-500 px-3 py-2 text-sm font-bold text-white"
        >
          {lineup ? "라인업 수정" : "+ 라인업 등록"}
        </button>
      </div>
      {lineup ? (
        <FormationBoard
          slots={lineup.slots}
          players={players}
          selectedSlotId={null}
          onSelectSlot={() => {}}
        />
      ) : (
        <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
          등록된 라인업이 없습니다.
        </div>
      )}
    </div>
  );
}
