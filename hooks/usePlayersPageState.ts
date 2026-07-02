import { PlayerSortType, PlayerType } from "@/types/player";
import { useState, Dispatch, SetStateAction } from "react";

interface UsePlayersPageStateParams {
  setPlayers: Dispatch<SetStateAction<PlayerType[]>>;
}

export function usePlayersPageState({
  setPlayers,
}: Readonly<UsePlayersPageStateParams>) {
  // 선수 이름 검색창 값
  const [search, setSearch] = useState("");
  // 어떤 기준으로 선수 목록을 정렬할지 저장
  const [sortType, setSortType] = useState<PlayerSortType>("latest");
  // 선수 추가 모달 열림/닫힘 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // 어떤 선수를 수정 중인지 기억
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  // 어떠 선수를 삭제하려는지 기억
  const [deletePlayer, setDeletePlayer] = useState<PlayerType | null>(null);

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

  // 생성 함수
  const handleCreate = (player: PlayerType) => {
    setPlayers((prev) => [...prev, player]);
    setIsCreateOpen(false);
  };

  // 수정 모달 저장 함수
  const handleEditSave = (updatedPlayer: PlayerType) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === updatedPlayer.id) {
          return updatedPlayer;
        }

        if (updatedPlayer.role === "captain" && player.role === "captain") {
          return {
            ...player,
            role: "member",
          };
        }

        if (
          updatedPlayer.role === "viceCaptain" &&
          player.role === "viceCaptain"
        ) {
          return {
            ...player,
            role: "member",
          };
        }
        return player;
      }),
    );

    setEditingPlayer(null);
  };

  const handleOpenDelete = (player: PlayerType) => {
    setDeletePlayer(player);
  };

  const handleCloseDelete = () => {
    setDeletePlayer(null);
  };

  // 삭제 함수
  const handleDelete = () => {
    if (!deletePlayer) return;

    setPlayers((prev) =>
      prev.filter((player) => player.id !== deletePlayer.id),
    );
    setDeletePlayer(null);
  };

  return {
    search,
    setSearch,
    sortType,
    setSortType,
    isCreateOpen,
    editingPlayer,
    deletePlayer,
    handleOpenCreate,
    handleCloseCreate,
    handleEdit,
    handleCloseEdit,
    handleCreate,
    handleEditSave,
    handleOpenDelete,
    handleCloseDelete,
    handleDelete,
  };
}
