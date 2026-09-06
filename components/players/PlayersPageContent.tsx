import type { usePlayersPageActions } from "@/hooks/players/usePlayersPageActions";
import type { usePlayersPageData } from "@/hooks/players/usePlayersPageData";
import type { usePlayersPageState } from "@/hooks/players/usePlayersPageState";
import PageHeader from "../PageHeader";
import PlayerToolbar from "./list/PlayerToolbar";
import PlayerCreateModal from "./modal/PlayerCreateModal";
import PlayerTable from "./list/PlayerTable";
import PlayerEditModal from "./modal/edit/PlayerEditModal";

interface PlayersPageContentProps {
  state: ReturnType<typeof usePlayersPageState>;
  data: ReturnType<typeof usePlayersPageData>;
  actions: ReturnType<typeof usePlayersPageActions>;
}

export default function PlayersPageContent({
  state,
  data,
  actions,
}: Readonly<PlayersPageContentProps>) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="선수 관리"
        description="등록된 선수 목록을 확인하고 관리하세요."
      />

      {!data.canManage && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          현재 계정은 읽기 전용입니다. 회장 또는 운영진만 선수 정보를 추가하거나
          수정할 수 있어요.
        </div>
      )}

      <PlayerToolbar
        search={state.search}
        totalCount={data.filteredPlayers.length}
        sortType={state.sortType}
        onSearchChange={state.setSearch}
        onChangeSortType={state.setSortType}
        onOpen={data.canManage ? state.handleOpenCreate : undefined}
      />

      {data.canManage && state.isCreateOpen && (
        <PlayerCreateModal
          onClose={state.handleCloseCreate}
          onSave={actions.handleCreatePlayer}
        />
      )}

      <PlayerTable
        players={data.filteredPlayers}
        onEdit={data.canManage ? state.handleEdit : undefined}
        onDelete={data.canManage ? actions.handleDeletePlayer : undefined}
      />

      {data.canManage && state.editingPlayer && (
        <PlayerEditModal
          key={state.editingPlayer.id}
          player={state.editingPlayer}
          connectableMembers={data.availableMembers}
          onClose={state.handleCloseEdit}
          onSave={actions.handleEditPlayer}
        />
      )}
    </div>
  );
}
