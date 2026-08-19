import type { TeamSeason, TeamSeasonFormValue } from "@/types/seasons";
import SeasonListItem from "./SeasonListItem";
import ContentState from "@/components/common/ContentState";

interface SeasonListProps {
  seasons: TeamSeason[];
  canManage: boolean;
  onUpdate: (seasonId: string, value: TeamSeasonFormValue) => Promise<boolean>;
  onSetActive: (seasonId: string) => Promise<boolean>;
  onDelete: (seasonId: string) => Promise<boolean>;
}

export default function SeasonList({
  seasons,
  canManage,
  onUpdate,
  onSetActive,
  onDelete,
}: Readonly<SeasonListProps>) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">시즌 목록</h2>
          <p className="mt-1 text-sm text-stone-900">
            팀에서 운영한 시즌을 확인하고 관리하세요.
          </p>
        </div>

        <span className="text-sm font-medium text-stone-500">
          총 {seasons.length}개
        </span>
      </div>

      {seasons.length === 0 ? (
        <ContentState
          variant="empty"
          title="등록된 시즌이 없어요."
          description={
            canManage
              ? "위에서 첫 번째 시즌을 만들어 보세요."
              : "운영진이 시즌을 등록하면 여기에 표시돼요."
          }
        />
      ) : (
        <div className="space-y-3">
          {seasons.map((season) => (
            <SeasonListItem
              key={season.id}
              season={season}
              canManage={canManage}
              onUpdate={onUpdate}
              onSetActive={onSetActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
