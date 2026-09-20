import type {
  ConnectableTeamMember,
  PlayerType,
  TeamMemberRole,
} from "@/types/player";
import { X } from "lucide-react";
import PlayerEditSummaryCard from "./PlayerEditSummaryCard";
import PlayerEditNumberSection from "./PlayerEditNumberSection";
import PlayerEditPositionSection from "./PlayerEditPositionSection";
import PlayerEditExtraInfoSection from "./PlayerEditExtraInfoSection";
import PlayerEditRoleSection from "./PlayerEditRoleSection";
import PlayerEditPermissionSection from "./PlayerEditPermissionSection";
import PlayerEditAccountSection from "./PlayerEditAccountSection";
import { usePlayerEditForm } from "@/hooks/players/usePlayerEditForm";
import { useEscapeKey } from "@/hooks/common/useEscapeKey";

interface PlayerEditModalProps {
  player: PlayerType;
  connectableMembers: ConnectableTeamMember[];
  onClose: () => void;
  onSave: (
    player: PlayerType,
    teamRole: TeamMemberRole,
  ) => void | Promise<void>;
}

export default function PlayerEditModal({
  player,
  connectableMembers,
  onClose,
  onSave,
}: Readonly<PlayerEditModalProps>) {
  const {
    form,
    isSubmitting,
    updateField,
    handleToggleDetailPosition,
    handleSubmit,
  } = usePlayerEditForm({
    player,
    onSave,
  });

  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:px-4 md:py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/35"
      />
      <dialog
        open
        aria-label={`${player.name} 선수 정보 수정`}
        className="relative z-10 m-0 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-0 bg-white p-4 pt-6 shadow-2xl md:rounded-xl md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm transition hover:bg-stone-50 hover:text-stone-700 sm:h-10 sm:w-10"
          aria-label="닫기"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
        </button>
        <div className="space-y-3.5 sm:space-y-5">
          <PlayerEditSummaryCard
            playerName={player.name}
            number={form.number}
            detailPositions={form.detailPositions}
            birth={form.birth}
            appearance={String(player.appearance ?? 0)}
            goal={String(player.goal ?? 0)}
            assist={String(player.assist ?? 0)}
          />
          <PlayerEditNumberSection
            number={form.number}
            onChangeNumber={(value) => updateField("number", value)}
          />

          <PlayerEditPositionSection
            detailPositions={form.detailPositions}
            onToggleDetailPosition={handleToggleDetailPosition}
          />
          <PlayerEditRoleSection
            role={form.role}
            onChangeRole={(value) => updateField("role", value)}
          />
          <PlayerEditPermissionSection
            role={form.teamRole}
            onChangeRole={(value) => updateField("teamRole", value)}
          />
          <PlayerEditAccountSection
            linkedUserId={player.userId}
            members={connectableMembers}
            selectedUserId={form.linkedUserId}
            onChangeSelectedUserId={(value) =>
              updateField("linkedUserId", value)
            }
          />

          <PlayerEditExtraInfoSection
            birth={form.birth}
            onChangeBirth={(value) => updateField("birth", value)}
            preferredFoot={form.preferredFoot}
            onChangePreferredFoot={(value) =>
              updateField("preferredFoot", value)
            }
            note={form.note}
            onChangeNote={(value) => updateField("note", value)}
          />

          <div className="flex justify-end gap-2 border-t border-stone-100 bg-white pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-stone-200 px-4 text-xs font-medium text-stone-500 transition hover:bg-stone-50 sm:px-5 sm:text-sm"
            >
              취소
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="h-11 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 sm:px-5 sm:text-sm"
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
