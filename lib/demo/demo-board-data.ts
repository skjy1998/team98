import type {
  TeamPost,
  TeamPostCommentsByPostId,
  TeamPostLikesByPostId,
} from "@/types/board";

export const demoBoardPosts: TeamPost[] = [
  {
    id: "demo-post-notice",
    teamId: "demo-team",
    authorId: "demo-user",
    authorName: "김민수",
    type: "notice",
    title: "10월 정기 경기 및 회비 안내",
    content:
      "10월 정기 경기는 매주 토요일 오후 3시에 진행합니다.\n참석 여부를 경기 일정에서 꼭 남겨 주세요.",
    isPinned: true,
    viewCount: 28,
    createdAt: "2026-09-25T10:00:00",
    updatedAt: "2026-09-25T10:00:00",
  },
  {
    id: "demo-post-general",
    teamId: "demo-team",
    authorId: "demo-player-2",
    authorName: "정우석",
    type: "general",
    title: "지난 경기 사진 공유합니다",
    content:
      "지난 라이벌FC전 사진을 공유합니다. 다음 경기에서도 좋은 분위기 이어가 봅시다.",
    isPinned: false,
    viewCount: 16,
    createdAt: "2026-09-22T19:30:00",
    updatedAt: "2026-09-22T19:30:00",
  },
];

export const demoBoardComments: TeamPostCommentsByPostId = {
  "demo-post-notice": [
    {
      id: "demo-comment-1",
      postId: "demo-post-notice",
      teamId: "demo-team",
      authorId: "demo-player-3",
      authorName: "이도현",
      content: "확인했습니다. 이번 주는 참석 가능합니다.",
      createdAt: "2026-09-25T10:20:00",
      updatedAt: "2026-09-25T10:20:00",
    },
  ],
  "demo-post-general": [
    {
      id: "demo-comment-2",
      postId: "demo-post-general",
      teamId: "demo-team",
      authorId: "demo-user",
      authorName: "김민수",
      content: "사진 감사합니다. 다음 경기 때도 잘 부탁드려요.",
      createdAt: "2026-09-22T20:10:00",
      updatedAt: "2026-09-22T20:10:00",
    },
  ],
};

export const demoBoardLikes: TeamPostLikesByPostId = {
  "demo-post-notice": {
    count: 5,
    isLiked: true,
  },
  "demo-post-general": {
    count: 3,
    isLiked: false,
  },
};
