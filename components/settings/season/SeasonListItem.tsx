import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import SeasonForm from "./SeasonForm";
import SeasonListItemDisplay from "./SeasonListItemDisplay";
import { useSeasonListItem } from "@/hooks/settings/useSeasonListItem";

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
  const {
    value,
    setValue,
    isEditing,
    isProcessing,
    handleOpenEdit,
    handleCancelEdit,
    handleUpdate,
    handleSetActive,
    handleDelete,
  } = useSeasonListItem({
    season,
    onUpdate,
    onSetActive,
    onDelete,
  });

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
