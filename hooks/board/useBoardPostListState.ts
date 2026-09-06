import { useRef, useState } from "react";

interface UseBoardPostListStateParams {
  onViewPost: (postId: string) => Promise<boolean>;
}

export function useBoardPostListState({
  onViewPost,
}: UseBoardPostListStateParams) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const viewedPostIds = useRef(new Set<string>());

  const handleTogglePost = async (postId: string) => {
    const isOpening = expandedPostId !== postId;

    setExpandedPostId(isOpening ? postId : null);

    if (!isOpening || viewedPostIds.current.has(postId)) return;

    viewedPostIds.current.add(postId);

    const success = await onViewPost(postId);

    if (!success) {
      viewedPostIds.current.delete(postId);
    }
  };

  return {
    expandedPostId,
    handleTogglePost,
  };
}
