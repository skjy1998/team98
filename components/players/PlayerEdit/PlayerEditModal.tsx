import type {
  ConnectableTeamMember,
  PlayerDetailPosition,
  PlayerPreferredFoot,
  PlayerRole,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import PlayerEditSummaryCard from "./PlayerEditSummaryCard";
import PlayerEditNumberSection from "./PlayerEditNumberSection";
import PlayerEditPositionSection from "./PlayerEditPositionSection";
import PlayerEditExtraInfoSection from "./PlayerEditExtraInfoSection";
import PlayerEditRoleSection from "./PlayerEditRoleSection";
import PlayerEditPermissionSection from "./PlayerEditPermissionSection";
import PlayerEditAccountSection from "./PlayerEditAccountSection";

interface PlayerEditModalProps {
  player: PlayerType;
  connectableMembers: ConnectableTeamMember[];
  onClose: () => void;
  onSave: (player: PlayerType, teamRole: TeamMemberRole) => void;
}

function getInitialEditState(player: PlayerType) {
  return {
    number: player.number ? String(player.number) : "",
    detailPositions: player.detailPositions ?? [],
    birth: player.birth ?? "",
    role: player.role ?? "member",
    preferredFoot: player.preferredFoot ?? "right",
    note: player.note ?? "",
    teamRole: player.teamMemberRole ?? "member",
    linkedUserId: player.userId ?? "",
  };
}

export default function PlayerEditModal({
  player,
  connectableMembers,
  onClose,
  onSave,
}: Readonly<PlayerEditModalProps>) {
  const initialState = getInitialEditState(player);

  const [number, setNumber] = useState(initialState.number);
  const [detailPositions, setDetailPositions] = useState<
    PlayerDetailPosition[]
  >(initialState.detailPositions);
  const [birth, setBirth] = useState(initialState.birth);
  const [role, setRole] = useState<PlayerRole>(initialState.role);
  const [preferredFoot, setPreferredFoot] = useState<PlayerPreferredFoot>(
    initialState.preferredFoot,
  );
  const [note, setNote] = useState(initialState.note);
  const [teamRole, setTeamRole] = useState<TeamMemberRole>(
    initialState.teamRole,
  );
  const [linkedUserId, setLinkedUserId] = useState(initialState.linkedUserId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    globalThis.window.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleToggleDetailPosition = (detail: PlayerDetailPosition) => {
    setDetailPositions((prev) =>
      prev.includes(detail)
        ? prev.filter((item) => item !== detail)
        : [...prev, detail],
    );
  };

  const handleSubmit = () => {
    const nextPlayer: PlayerType = {
      ...player,
      userId: linkedUserId || undefined,
      number: number ? Number(number) : undefined,
      detailPositions: detailPositions.length > 0 ? detailPositions : undefined,
      birth: birth || undefined,
      role,
      preferredFoot: preferredFoot,
      note: note.trim() || undefined,
    };

    onSave(nextPlayer, teamRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/35"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-0 top-0 z-20 flex h-8 w-8 translate-x-[-6px] translate-y-[6px] items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm transition hover:bg-stone-50 hover:text-stone-700"
          aria-label="닫기"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <div className="space-y-5">
          <PlayerEditSummaryCard
            playerName={player.name}
            number={number}
            detailPositions={detailPositions}
            birth={birth}
            appearance={String(player.appearance ?? 0)}
            goal={String(player.goal ?? 0)}
            assist={String(player.assist ?? 0)}
          />
          <PlayerEditNumberSection number={number} onChangeNumber={setNumber} />

          <PlayerEditPositionSection
            detailPositions={detailPositions}
            onToggleDetailPosition={handleToggleDetailPosition}
          />
          <PlayerEditRoleSection role={role} onChangeRole={setRole} />
          <PlayerEditPermissionSection
            role={teamRole}
            onChangeRole={setTeamRole}
          />
          <PlayerEditAccountSection
            linkedUserId={player.userId}
            members={connectableMembers}
            selectedUserId={linkedUserId}
            onChangeSelectedUserId={setLinkedUserId}
          />

          <PlayerEditExtraInfoSection
            birth={birth}
            onChangeBirth={setBirth}
            preferredFoot={preferredFoot}
            onChangePreferredFoot={setPreferredFoot}
            note={note}
            onChangeNote={setNote}
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full border border-stone-200 px-5 text-sm font-medium text-stone-500 transition hover:bg-stone-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-12 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
