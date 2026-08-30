"use client";
import PageHeader from "../PageHeader";
import BoardToolbar from "./BoardToolbar";
import BoardPostList from "./BoardPostList";
import BoardPostModal from "./BoardPostModal";
import ContentState from "../common/ContentState";
import { useBoardPageData } from "@/hooks/board/useBoardPageData";
import { useBoardPageState } from "@/hooks/board/useBoardPageState";

export default function BoardPageClient() {
  const {
    posts,
    boardLoaded,
    boardError,
    currentUserId,
    canManage,
    createPost,
    updatePost,
    deletePost,
    incrementPostViewCount,
    commentsByPostId,
    commentsLoaded,
    commentsError,
    createComment,
    updateComment,
    deleteComment,
    likesByPostId,
    likesLoaded,
    likesError,
    togglePostLike,
    reloadBoardData,
  } = useBoardPageData();

  const {
    search,
    onChangeSearch,
    filter,
    onChangeFilter,
    filteredPosts,
    hasSearchCondition,
    editingPost,
    onStartEdit,
    onCloseEdit,
    isCreateOpen,
    onOpenCreate,
    onCloseCreate,
    handleTogglePin,
    handleSaveEdit,
    handleDeletePost,
  } = useBoardPageState({
    posts,
    updatePost,
    deletePost,
  });

  const commentState = {
    commentsByPostId,
    commentsLoaded,
    commentsError,
    onCreateComment: createComment,
    onUpdateComment: updateComment,
    onDeleteComment: deleteComment,
  };

  const likeState = {
    likesByPostId,
    likesLoaded,
    onToggleLike: togglePostLike,
  };

  const postActions = {
    currentUserId,
    canManage,
    onEdit: onStartEdit,
    onTogglePin: handleTogglePin,
    onDelete: handleDeletePost,
    onViewPost: incrementPostViewCount,
  };

  const secondaryError = [commentsError, likesError].filter(Boolean).join(" ");

  if (!boardLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="게시판"
          description="팀 공지와 게시물을 확인하고 이야기를 나누세요."
        />
        <ContentState
          variant="loading"
          title="게시물을 불러오는 중..."
          description="팀 공지와 게시판 내용을 준비하고 있어요."
        />
      </div>
    );
  }

  if (boardError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="게시판"
          description="팀 공지와 게시물을 확인하고 이야기를 나누세요."
        />

        <ContentState
          variant="error"
          title="게시물을 불러오지 못했어요."
          description={boardError}
          action={
            <button
              type="button"
              onClick={() => void reloadBoardData()}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              다시 시도
            </button>
          }
        />
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

      {secondaryError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
          <p className="text-sm font-medium text-rose-600">{secondaryError}</p>

          <button
            type="button"
            onClick={() => void reloadBoardData()}
            className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            다시 불러오기
          </button>
        </div>
      )}

      <BoardToolbar
        search={search}
        filter={filter}
        onChangeSearch={onChangeSearch}
        onChangeFilter={onChangeFilter}
        onOpenCreate={onOpenCreate}
      />
      <BoardPostList
        posts={filteredPosts}
        hasSearchCondition={hasSearchCondition}
        commentState={commentState}
        likeState={likeState}
        postActions={postActions}
      />
      {isCreateOpen && (
        <BoardPostModal
          canManage={canManage}
          onClose={onCloseCreate}
          onSave={createPost}
        />
      )}
      {editingPost && (
        <BoardPostModal
          post={editingPost}
          canManage={canManage}
          onClose={onCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
