import type { PlayerType } from "@/types/player";
import type { FormationSlot } from "@/types/tactics";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import TacticsPlayerList from "./TacticsPlayerList";

interface TacticsMobilePlayerPickerProps {
  isOpen: boolean;
  selectedSlot?: FormationSlot;
  playersLoaded: boolean;
  availablePlayers: (PlayerType & { isRecommended?: boolean })[];
  getPlayerById: (playerId?: string) => PlayerType | undefined;
  onAssignPlayer: (playerId: string) => void;
  onClearSlot: () => void;
  onClose: () => void;
  emptyMessage?: string;
  canManage: boolean;
}

export default function TacticsMobilePlayerPicker({
  isOpen,
  selectedSlot,
  playersLoaded,
  availablePlayers,
  getPlayerById,
  onAssignPlayer,
  onClearSlot,
  onClose,
  emptyMessage,
  canManage,
}: Readonly<TacticsMobilePlayerPickerProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncDialog = () => {
      if (!mediaQuery.matches || !isOpen) {
        if (dialog.open) {
          dialog.close();
        }

        return;
      }

      if (!dialog.open) {
        dialog.showModal();
      }
    };

    syncDialog();
    mediaQuery.addEventListener("change", syncDialog);

    return () => {
      mediaQuery.removeEventListener("change", syncDialog);

      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  const assignedPlayer = selectedSlot?.playerId
    ? getPlayerById(selectedSlot.playerId)
    : undefined;

  const handleAssignPlayer = (playerId: string) => {
    onAssignPlayer(playerId);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-stone-900/35 md:hidden"
    >
      <div className="flex min-h-full items-end">
        <section className="max-h-[82dvh] w-full overflow-y-auto rounded-t-[28px] bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-stone-200" />

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-400">
                선택한 포지션
              </p>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">
                {selectedSlot?.label ?? "포지션 선택"}
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                {assignedPlayer
                  ? `${assignedPlayer.name} 배치됨`
                  : "배치할 선수를 선택하세요."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="선수 선택 닫기"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-50"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {canManage && selectedSlot?.playerId && (
            <button
              type="button"
              onClick={onClearSlot}
              className="mt-4 w-full rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-semibold text-rose-600"
            >
              선택 포지션 비우기
            </button>
          )}

          <div className="mt-4">
            <TacticsPlayerList
              playersLoaded={playersLoaded}
              availablePlayers={availablePlayers}
              selectedSlotId={selectedSlot?.id ?? null}
              onAssignPlayer={handleAssignPlayer}
              emptyMessage={emptyMessage}
              canManage={canManage}
            />
          </div>
        </section>
      </div>
    </dialog>
  );
}
