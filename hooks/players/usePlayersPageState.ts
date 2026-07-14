import { PlayerSortType, PlayerType } from "@/types/player";
import { useState } from "react";

export function usePlayersPageState() {
  // 선수 이름 검색창 값
  const [search, setSearch] = useState("");
  // 어떤 기준으로 선수 목록을 정렬할지 저장
  const [sortType, setSortType] = useState<PlayerSortType>("latest");
  // 선수 추가 모달 열림/닫힘 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // 어떤 선수를 수정 중인지 기억
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  // 어떠 선수를 삭제하려는지 기억
  const [deletingPlayer, setDeletingPlayer] = useState<PlayerType | null>(null);

  // 새 선수 추가 버튼 눌렀을 때 실행
  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  // 수정 함수
  const handleEdit = (player: PlayerType) => {
    setIsCreateOpen(false);
    setEditingPlayer(player);
  };

  const handleCloseEdit = () => {
    setEditingPlayer(null);
  };

  const handleOpenDelete = (player: PlayerType) => {
    setDeletingPlayer(player);
  };

  const handleCloseDelete = () => {
    setDeletingPlayer(null);
  };

  return {
    search,
    setSearch,
    sortType,
    setSortType,
    isCreateOpen,
    editingPlayer,
    deletingPlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
  };
}
