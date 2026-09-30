"use client";

import { useDemoData } from "@/components/demo/DemoModeProvider";
import PageHeader from "@/components/PageHeader";
import BoardContent from "@/components/board/BoardContent";
import { useBoardPageState } from "@/hooks/board/useBoardPageState";

export default function DemoBoardPage() {
  const {
    boardPosts,
    createBoardPost,
    updateBoardPost,
    deleteBoardPost,
    incrementBoardPostViewCount,
    boardComments,
    createBoardComment,
    updateBoardComment,
    deleteBoardComment,
    boardLikes,
    toggleBoardPostLike,
  } = useDemoData();

  const boardState = useBoardPageState({
    posts: boardPosts,
    updatePost: updateBoardPost,
    deletePost: deleteBoardPost,
  });

  const boardData = {
    posts: boardPosts,
    boardLoaded: true,
    boardError: "",
    commentsError: "",
    likesError: "",
    reloadBoardData: async () => {},
    currentUserId: "demo-user",
    canManage: true,
    createPost: createBoardPost,
    updatePost: updateBoardPost,
    deletePost: deleteBoardPost,
    incrementPostViewCount: incrementBoardPostViewCount,
    commentsByPostId: boardComments,
    commentsLoaded: true,
    createComment: createBoardComment,
    updateComment: updateBoardComment,
    deleteComment: deleteBoardComment,
    likesByPostId: boardLikes,
    likesLoaded: true,
    togglePostLike: toggleBoardPostLike,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <PageHeader
          title="게시판"
          description="팀 공지와 게시물을 확인하고 이야기를 나누세요."
        />
        <p className="text-xs font-medium text-stone-500 sm:text-sm">
          총 {boardPosts.length}개
        </p>
      </div>

      <BoardContent data={boardData} state={boardState} />
    </div>
  );
}
