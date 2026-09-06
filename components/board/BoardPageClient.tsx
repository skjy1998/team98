"use client";
import PageHeader from "../PageHeader";
import ContentState from "../common/ContentState";
import { useBoardPageData } from "@/hooks/board/useBoardPageData";
import { useBoardPageState } from "@/hooks/board/useBoardPageState";
import BoardContent from "./BoardContent";

export default function BoardPageClient() {
  const boardData = useBoardPageData();

  const {
    posts,
    boardLoaded,
    boardError,
    commentsError,
    likesError,
    reloadBoardData,
  } = boardData;

  const boardState = useBoardPageState({
    posts,
    updatePost: boardData.updatePost,
    deletePost: boardData.deletePost,
  });

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
      <BoardContent data={boardData} state={boardState} />
    </div>
  );
}
