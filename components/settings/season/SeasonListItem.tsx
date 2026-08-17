import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import { useState } from "react";
import SeasonForm from "./SeasonForm";
import { CalendarRange, CheckCircle2, Pencil, Trash2 } from "lucide-react";

interface SeasonListItemProps {
  season: TeamSeason;
  canManage: boolean;
  onUpdate: (seasonId: string, value: TeamSeasonFormValue) => Promise<boolean>;
  onSetActive: (seasonId: string) => Promise<boolean>;
  onDelete: (seasonId: string) => Promise<boolean>;
}

function formatSeasonDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function getFormValue(season: TeamSeason): TeamSeasonFormValue {
  return {
    name: season.name,
    startDate: season.startDate,
    endDate: season.endDate,
  };
}

export default function SeasonListItem({
  season,
  canManage,
  onUpdate,
  onSetActive,
  onDelete,
}: Readonly<SeasonListItemProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<TeamSeasonFormValue>(() =>
    getFormValue(season),
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenEdit = () => {
    setValue(getFormValue(season));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setValue(getFormValue(season));
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    setIsProcessing(true);
    const success = await onUpdate(season.id, value);
    setIsProcessing(false);

    if (!success) {
      globalThis.alert(
        "시즌 수정에 실패했어요. 같은 이름의 시즌이 있는지 확인해 주세요.",
      );
      return;
    }

    setIsEditing(false);
  };

  const handleSetActive = async () => {
    const confirmed = globalThis.confirm(
      `"${season.name}" 시즌을 활성 시즌으로 변경할까요?`,
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const success = await onSetActive(season.id);
    setIsProcessing(false);

    if (!success) {
      globalThis.alert("활성 시즌 변경에 실패했어요.");
    }
  };

  const handleDelete = async () => {
    const confirmed = globalThis.confirm(`"${season.name}" 시즌을 삭제할까요?`);

    if (!confirmed) return;

    setIsProcessing(true);
    const success = await onDelete(season.id);
    setIsProcessing(false);

    if (!success) {
      globalThis.alert(
        "시즌 삭제에 실패했어요. 활성 시즌이거나 연결된 경기가 있는지 확인해 주세요.",
      );
    }
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
        <div className="flex items-start gap-4">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              season.isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-stone-100 text-stone-500",
            ].join(" ")}
          >
            <CalendarRange className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-stone-900">{season.name}</h3>

              {season.isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  활성 시즌
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-stone-500">
              {formatSeasonDate(season.startDate)}
              <span className="mx-2 text-stone-300">-</span>
              {season.endDate
                ? formatSeasonDate(season.endDate)
                : "종료일 미정"}
            </p>
          </div>

          {canManage && (
            <div className="flex shrink-0 items-center gap-2">
              {!season.isActive && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSetActive}
                  className="h-9 rounded-lg border border-emerald-200 px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  활성화
                </button>
              )}

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleOpenEdit}
                aria-label={`${season.name} 수정`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
              >
                <Pencil className="h-4 w-4" />
              </button>

              {!season.isActive && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDelete}
                  aria-label={`${season.name} 삭제`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
