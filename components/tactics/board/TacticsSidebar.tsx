import type { PlayerType } from "@/types/player";
import type { FormationSlot } from "@/types/tactics";
import TacticsSelectedSlotCard from "./TacticsSelectedSlotCard";
import TacticsPlayerList from "./TacticsPlayerList";
import TacticsKickerSection from "./TacticsKickerSection";

interface TacticsSidebarProps {
  playersLoaded: boolean;
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
  playerListEmptyMessage?: string;
  canManage: boolean;
}

export default function TacticsSidebar({
  playersLoaded,
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
  playerListEmptyMessage,
  canManage,
}: Readonly<TacticsSidebarProps>) {
  const cornerKickPlayer = getPlayerById(cornerKickPlayerId);
  const freeKickPlayer = getPlayerById(freeKickPlayerId);
  const penaltyKickPlayer = getPlayerById(penaltyKickPlayerId);
  return (
    <aside className="space-y-4">
      <TacticsSelectedSlotCard
        selectedSlot={selectedSlot}
        getPlayerById={getPlayerById}
        onClearSlot={onClearSlot}
        canManage={canManage}
      />
      <TacticsPlayerList
        playersLoaded={playersLoaded}
        availablePlayers={availablePlayers}
        selectedSlotId={selectedSlotId}
        onAssignPlayer={onAssignPlayer}
        emptyMessage={playerListEmptyMessage}
        canManage={canManage}
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
        canManage={canManage}
      />
    </aside>
  );
}
