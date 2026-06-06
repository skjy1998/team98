import { PlayerType } from "@/types/player";
import { FormationSlot } from "@/types/tactics";
import TacticsSelectedSlotCard from "./TacticsSelectedSlotCard";
import TacticsPlayerList from "./TacticsPlayerList";
import TacticsKickerSection from "./TacticsKickerSection";

interface TacticsSidebarProps {
  loaded: boolean;
  players: PlayerType[];
  availablePlayers: PlayerType[];
  selectedSlot?: FormationSlot;
  selectedSlotId: string | null;
  onAssignPlayer: (playerId: string) => void;
  onClearSlot: () => void;
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  cornerKickPlayerId: string;
  freeKickPlayerId: string;
  penaltyKickPlayerId: string;
  onChangeCornerKickPlayerId: (value: string) => void;
  onChangeFreeKickPlayerId: (value: string) => void;
  onChangePenaltyKickPlayerId: (value: string) => void;
  cornerKickPlayer?: PlayerType;
  freeKickPlayer?: PlayerType;
  penaltyKickPlayer?: PlayerType;
}

export default function TacticsSidebar({
  loaded,
  players,
  availablePlayers,
  selectedSlot,
  selectedSlotId,
  onAssignPlayer,
  onClearSlot,
  getPlayerById,
  cornerKickPlayerId,
  freeKickPlayerId,
  penaltyKickPlayerId,
  onChangeCornerKickPlayerId,
  onChangeFreeKickPlayerId,
  onChangePenaltyKickPlayerId,
  cornerKickPlayer,
  freeKickPlayer,
  penaltyKickPlayer,
}: Readonly<TacticsSidebarProps>) {
  return (
    <aside className="space-y-4">
      <TacticsSelectedSlotCard
        selectedSlot={selectedSlot}
        getPlayerById={getPlayerById}
        onClearSlot={onClearSlot}
      />
      <TacticsPlayerList
        loaded={loaded}
        availablePlayers={availablePlayers}
        selectedSlotId={selectedSlotId}
        onAssignPlayer={onAssignPlayer}
      />
      <TacticsKickerSection
        players={players}
        cornerKickPlayerId={cornerKickPlayerId}
        freeKickPlayerId={freeKickPlayerId}
        penaltyKickPlayerId={penaltyKickPlayerId}
        onChangeCornerKickPlayerId={onChangeCornerKickPlayerId}
        onChangeFreeKickPlayerId={onChangeFreeKickPlayerId}
        onChangePenaltyKickPlayerId={onChangePenaltyKickPlayerId}
        cornerKickPlayer={cornerKickPlayer}
        freeKickPlayer={freeKickPlayer}
        penaltyKickPlayer={penaltyKickPlayer}
      />
    </aside>
  );
}
