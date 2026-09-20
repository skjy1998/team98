import type { PlayerType } from "@/types/player";
import type { FormationSlot, SetPieceKey } from "@/types/tactics";
import TacticsSelectedSlotCard from "./TacticsSelectedSlotCard";
import TacticsPlayerList from "./TacticsPlayerList";
import TacticsKickerSection from "./TacticsKickerSection";
import TacticsMobilePlayerPicker from "./TacticsMobilePlayerPicker";

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
  onChangeSetPiecePlayer: (key: SetPieceKey, value: string) => void;
  playerListEmptyMessage?: string;
  showKickerSection?: boolean;
  onCloseSlotPicker: () => void;
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
  onChangeSetPiecePlayer,
  playerListEmptyMessage,
  showKickerSection = true,
  onCloseSlotPicker,
  canManage,
}: Readonly<TacticsSidebarProps>) {
  return (
    <>
      <aside className="hidden space-y-4 md:block">
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
        {showKickerSection && (
          <TacticsKickerSection
            players={players}
            cornerKickPlayerId={cornerKickPlayerId}
            freeKickPlayerId={freeKickPlayerId}
            penaltyKickPlayerId={penaltyKickPlayerId}
            onChangeSetPiecePlayer={onChangeSetPiecePlayer}
            canManage={canManage}
          />
        )}
      </aside>
      <TacticsMobilePlayerPicker
        isOpen={selectedSlotId !== null}
        selectedSlot={selectedSlot}
        playersLoaded={playersLoaded}
        availablePlayers={availablePlayers}
        getPlayerById={getPlayerById}
        onAssignPlayer={onAssignPlayer}
        onClearSlot={onClearSlot}
        onClose={onCloseSlotPicker}
        emptyMessage={playerListEmptyMessage}
        canManage={canManage}
      />
      {showKickerSection && (
        <div className="mt-4 md:hidden">
          <TacticsKickerSection
            players={players}
            cornerKickPlayerId={cornerKickPlayerId}
            freeKickPlayerId={freeKickPlayerId}
            penaltyKickPlayerId={penaltyKickPlayerId}
            onChangeSetPiecePlayer={onChangeSetPiecePlayer}
            canManage={canManage}
          />
        </div>
      )}
    </>
  );
}
