import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { useState } from "react";
import SeasonForm from "./SeasonForm";
import { useToastStore } from "@/stores/toast-store";
import { useConfirmStore } from "@/stores/confirm-store";
import { getSeasonFormValue } from "@/lib/settings/settings-ui";
import SeasonListItemDisplay from "./SeasonListItemDisplay";

interface SeasonListItemProps {
  season: TeamSeason;
  canManage: boolean;
  onUpdate: (seasonId: string, value: TeamSeasonFormValue) => Promise<boolean>;
  onSetActive: (seasonId: string) => Promise<boolean>;
  onDelete: (seasonId: string) => Promise<boolean>;
}

export default function SeasonListItem({
  season,
  canManage,
  onUpdate,
  onSetActive,
  onDelete,
}: Readonly<SeasonListItemProps>) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<TeamSeasonFormValue>(() =>
    getSeasonFormValue(season),
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const runAction = async (action: () => Promise<boolean>) => {
    setIsProcessing(true);

    try {
      return await action();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenEdit = () => {
    setValue(getSeasonFormValue(season));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setValue(getSeasonFormValue(season));
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    const success = await runAction(() => onUpdate(season.id, value));

    if (!success) {
      showToast(
        "시즌 수정에 실패했어요. 같은 이름의 시즌이 있는지 확인해 주세요.",
        "error",
      );
      return;
    }

    showToast("시즌 정보를 수정했어요.", "success");
    setIsEditing(false);
  };

  const handleSetActive = async () => {
    const confirmed = await confirm({
      title: "활성 시즌 변경",
      description: `"${season.name}" 시즌을 활성 시즌으로 변경할까요?`,
      confirmLabel: "변경",
    });

    if (!confirmed) return;

    const success = await runAction(() => onSetActive(season.id));

    if (!success) {
      showToast("활성 시즌 변경에 실패했어요.", "error");
      return;
    }

    showToast(`"${season.name}" 시즌을 활성화했어요.`, "success");
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "시즌 삭제",
      description: `"${season.name}" 시즌을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.`,
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await runAction(() => onDelete(season.id));

    if (!success) {
      showToast(
        "시즌 삭제에 실패했어요. 활성 시즌이거나 연결된 경기가 있는지 확인해 주세요.",
        "error",
      );
      return;
    }

    showToast(`"${season.name}" 시즌을 삭제했어요.`, "success");
  };

  return (
    <article
      className={[
        "rounded-xl border bg-white p-5 shadow-sm",
        season.isActive ? "border-emerald-300" : "border-stone-200",
      ].join(" ")}
    >
      {isEditing ? (
        <>
          <div className="mb-5">
            <h3 className="font-semibold text-stone-900">시즌 수정</h3>
            <p className="mt-1 text-sm text-stone-500">
              시즌 이름과 운영 기간을 수정하세요.
            </p>
          </div>

          <SeasonForm
            value={value}
            isSaving={isProcessing}
            submitLabel="수정 완료"
            onChange={setValue}
            onSubmit={handleUpdate}
            onCancel={handleCancelEdit}
          />
        </>
      ) : (
        <SeasonListItemDisplay
          season={season}
          canManage={canManage}
          isProcessing={isProcessing}
          onOpenEdit={handleOpenEdit}
          onSetActive={handleSetActive}
          onDelete={handleDelete}
        />
      )}
    </article>
  );
}
