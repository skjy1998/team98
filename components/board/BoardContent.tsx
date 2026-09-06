import type { useBoardPageData } from "@/hooks/board/useBoardPageData";
import type { useBoardPageState } from "@/hooks/board/useBoardPageState";
import BoardToolbar from "./BoardToolbar";
import BoardPostList from "./BoardPostList";
import BoardPostModal from "./BoardPostModal";

interface BoardContentProps {
  data: ReturnType<typeof useBoardPageData>;
  state: ReturnType<typeof useBoardPageState>;
}

export default function BoardContent({
  data,
  state,
}: Readonly<BoardContentProps>) {
  const commentState = {
    commentsByPostId: data.commentsByPostId,
    commentsLoaded: data.commentsLoaded,
    commentsError: data.commentsError,
    onCreateComment: data.createComment,
    onUpdateComment: data.updateComment,
    onDeleteComment: data.deleteComment,
  };

  const likeState = {
    likesByPostId: data.likesByPostId,
    likesLoaded: data.likesLoaded,
    onToggleLike: data.togglePostLike,
  };

  const postActions = {
    currentUserId: data.currentUserId,
    canManage: data.canManage,
    onEdit: state.onStartEdit,
    onTogglePin: state.handleTogglePin,
    onDelete: state.handleDeletePost,
    onViewPost: data.incrementPostViewCount,
  };

  return (
    <>
      <BoardToolbar
        search={state.search}
        filter={state.filter}
        onChangeSearch={state.onChangeSearch}
        onChangeFilter={state.onChangeFilter}
        onOpenCreate={state.onOpenCreate}
      />
      <BoardPostList
        posts={state.filteredPosts}
        hasSearchCondition={state.hasSearchCondition}
        commentState={commentState}
        likeState={likeState}
        postActions={postActions}
      />

      {state.isCreateOpen && (
        <BoardPostModal
          canManage={data.canManage}
          onClose={state.onCloseCreate}
          onSave={data.createPost}
        />
      )}

      {state.editingPost && (
        <BoardPostModal
          post={state.editingPost}
          canManage={data.canManage}
          onClose={state.onCloseEdit}
          onSave={state.handleSaveEdit}
        />
      )}
    </>
  );
}
