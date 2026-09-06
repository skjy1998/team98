import ContentState from "@/components/common/ContentState";
import SeasonSelect from "@/components/common/SeasonSelect";
import PageHeader from "@/components/PageHeader";
import type { useMatchesPageData } from "@/hooks/matches/useMatchesPageData";
import MatchSection from "./MatchSection";
import MatchCreateModal from "./create/MatchCreateModal";

interface MatchesPageContentProps {
  data: ReturnType<typeof useMatchesPageData>;
}

export default function MatchesPageContent({
  data,
}: Readonly<MatchesPageContentProps>) {
  const hasMatches = data.displayMatches.length > 0;

  const emptyDescription = data.canCreateMatch
    ? "일정 등록 버튼으로 첫 경기를 추가해보세요."
    : "아직 등록된 경기 일정이 없어요.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="경기 일정"
          description="다가오는 경기와 지난 경기를 확인하고 관리하세요."
        />

        {data.canCreateMatch && (
          <button
            type="button"
            onClick={data.onOpenCreate}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            + 일정 등록
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeasonSelect
          seasons={data.seasons}
          selectedSeasonId={data.selectedSeason?.id}
          ariaLabel="조회할 시즌 선택"
          onChange={data.onChangeSeason}
        />

        <span className="text-sm font-medium text-stone-500">
          총 {data.displayMatches.length}경기
        </span>
      </div>

      {!data.canManage && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          현재 계정은 읽기 전용이에요. 회장 또는 운영진만 경기 일정을 등록하고
          수정할 수 있어요.
        </div>
      )}

      {data.canManage &&
        data.selectedSeason &&
        !data.selectedSeason.isActive && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            지난 시즌을 조회하고 있어요. 경기 일정은 활성 시즌에만 등록할 수
            있어요.
          </div>
        )}

      {!hasMatches ? (
        <ContentState
          variant="empty"
          title="등록된 경기 일정이 없어요."
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-8">
          <MatchSection title="다가오는 경기" items={data.upcomingMatches} />
          <MatchSection title="지난 경기" items={data.pastMatches} />
        </div>
      )}

      {data.isCreateOpen && (
        <MatchCreateModal
          defaultSport={data.defaultSport}
          onClose={data.onCloseCreate}
          onSave={data.onCreateMatch}
        />
      )}
    </div>
  );
}
