"use client";

import { useTeamPosts } from "@/hooks/board/useTeamPosts";
import { getFilteredPosts } from "@/lib/board/board-ui";
import type {
  BoardPostFilter,
  TeamPost,
  TeamPostFormValue,
} from "@/types/board";
import { useMemo, useState } from "react";
import PageHeader from "../PageHeader";
import BoardToolbar from "./BoardToolbar";
import BoardPostList from "./BoardPostList";
import BoardPostModal from "./BoardPostModal";
import { useTeamPostComments } from "@/hooks/board/useTeamPostComments";
import { useTeamPostLikes } from "@/hooks/board/useTeamPostLikes";

export default function BoardPageClient() {
  const {
    posts,
    postsLoaded,
    postsError,
    currentUserId,
    canManage,
    createPost,
    updatePost,
    deletePost,
    incrementPostViewCount,
  } = useTeamPosts();

  const {
    commentsByPostId,
    commentsLoaded,
    commentsError,
    createComment,
    updateComment,
    deleteComment,
  } = useTeamPostComments();

  const { likesByPostId, likesLoaded, likesError, togglePostLike } =
    useTeamPostLikes();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BoardPostFilter>("all");
  const [editingPost, setEditingPost] = useState<TeamPost | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleTogglePin = async (post: TeamPost) => {
    const success = await updatePost(post.id, {
      type: post.type,
      title: post.title,
      content: post.content,
      isPinned: !post.isPinned,
    });

    if (!success) {
      globalThis.alert(
        post.isPinned
          ? "게시물 고정 해제에 실패했어요."
          : "게시물 고정에 실패했어요.",
      );
    }
  };

  const handleSaveEdit = async (value: TeamPostFormValue) => {
    if (!editingPost) return false;

    return updatePost(editingPost.id, value);
  };

  const handleDeletePost = async (post: TeamPost) => {
    const confirmed = globalThis.confirm(
      `"${post.title}" 게시물을 삭제할까요?`,
    );

    if (!confirmed) return;

    const success = await deletePost(post.id);

    if (!success) {
      globalThis.alert("게시물 삭제에 실패했어요.");
    }
  };

  const filteredPosts = useMemo(
    () => getFilteredPosts(posts, filter, search),
    [posts, filter, search],
  );

  if (!postsLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="게시판"
          description="팀 공지와 게시물을 확인하고 이야기를 나누세요."
        />
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
          게시물을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <PageHeader
          title="게시판"
          description="팀 공지와 게시물을 확인하고 이야기를 나누세요."
        />
        <p className="text-sm font-medium text-stone-500">
          총 {posts.length}개
        </p>
      </div>

      {postsError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
          {postsError}
        </div>
      )}

      {likesError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
          {likesError}
        </div>
      )}

      <BoardToolbar
        search={search}
        filter={filter}
        onChangeSearch={setSearch}
        onChangeFilter={setFilter}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
      <BoardPostList
        posts={filteredPosts}
        hasSearchCondition={Boolean(search.trim()) || filter !== "all"}
        currentUserId={currentUserId}
        canManage={canManage}
        commentsByPostId={commentsByPostId}
        commentsLoaded={commentsLoaded}
        commentsError={commentsError}
        onCreateComment={createComment}
        onUpdateComment={updateComment}
        onDeleteComment={deleteComment}
        onEdit={setEditingPost}
        onTogglePin={handleTogglePin}
        onDelete={handleDeletePost}
        onViewPost={incrementPostViewCount}
        likesByPostId={likesByPostId}
        likesLoaded={likesLoaded}
        onToggleLike={togglePostLike}
      />
      {isCreateOpen && (
        <BoardPostModal
          canManage={canManage}
          onClose={() => setIsCreateOpen(false)}
          onSave={createPost}
        />
      )}
      {editingPost && (
        <BoardPostModal
          post={editingPost}
          canManage={canManage}
          onClose={() => setEditingPost(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
