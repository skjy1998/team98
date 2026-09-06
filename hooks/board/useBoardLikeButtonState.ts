import { useToastStore } from "@/stores/toast-store";
import { useRef, useState } from "react";

interface UseBoardLikeButtonStateParams {
  likesLoaded: boolean;
  onToggleLike: () => Promise<boolean>;
}

export function useBoardLikeButtonState({
  likesLoaded,
  onToggleLike,
}: UseBoardLikeButtonStateParams) {
  const showToast = useToastStore((state) => state.showToast);
  const [isLikeSubmitting, setIsLikeSubmitting] = useState(false);
  const isLikeSubmittingRef = useRef(false);

  const handleToggleLike = async () => {
    if (!likesLoaded || isLikeSubmittingRef.current) return;

    isLikeSubmittingRef.current = true;
    setIsLikeSubmitting(true);

    try {
      const success = await onToggleLike();

      if (!success) {
        showToast("좋아요 처리에 실패했어요.", "error");
      }
    } finally {
      isLikeSubmittingRef.current = false;
      setIsLikeSubmitting(false);
    }
  };

  return {
    isLikeSubmitting,
    handleToggleLike,
  };
}
