import { getFilteredPosts } from "@/lib/board/board-ui";
import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type {
  BoardPostFilter,
  TeamPost,
  TeamPostFormValue,
} from "@/types/board";
import { useMemo, useState } from "react";

interface UseBoardPageStateParams {
  posts: TeamPost[];
  updatePost: (postId: string, value: TeamPostFormValue) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
}

export function useBoardPageState({
  posts,
  updatePost,
  deletePost,
}: UseBoardPageStateParams) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BoardPostFilter>("all");
  const [editingPost, setEditingPost] = useState<TeamPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredPosts = useMemo(
    () => getFilteredPosts(posts, filter, search),
    [posts, filter, search],
  );

  const handleTogglePin = async (post: TeamPost) => {
    const success = await updatePost(post.id, {
      type: post.type,
      title: post.title,
      content: post.content,
      isPinned: !post.isPinned,
    });

    if (!success) {
      showToast(
        post.isPinned
          ? "게시물 고정 해제에 실패했어요."
          : "게시물 고정에 실패했어요.",
        "error",
      );
      return;
    }

    showToast(
      post.isPinned
        ? "게시물 고정을 해제했어요."
        : "게시물을 상단에 고정했어요.",
      "success",
    );
  };

  const handleSaveEdit = async (value: TeamPostFormValue) => {
    if (!editingPost) return false;

    return updatePost(editingPost.id, value);
  };

  const handleDeletePost = async (post: TeamPost) => {
    const confirmed = await confirm({
      title: "게시물 삭제",
      description: `"${post.title}" 게시물을 삭제할까요? 작성된 댓글도 함께 삭제되며 되돌릴 수 없어요.`,
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    const success = await deletePost(post.id);

    if (!success) {
      showToast("게시물 삭제에 실패했어요.", "error");
      return;
    }

    showToast("게시물을 삭제했어요.", "success");
  };

  return {
    search,
    onChangeSearch: setSearch,
    filter,
    onChangeFilter: setFilter,
    filteredPosts,
    hasSearchCondition: Boolean(search.trim()) || filter !== "all",
    editingPost,
    onStartEdit: setEditingPost,
    onCloseEdit: () => setEditingPost(null),
    isCreateOpen,
    onOpenCreate: () => setIsCreateOpen(true),
    onCloseCreate: () => setIsCreateOpen(false),
    handleTogglePin,
    handleSaveEdit,
    handleDeletePost,
  };
}
