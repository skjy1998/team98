import { useToastStore } from "@/stores/toast-store";
import { PostType, type TeamPost, type TeamPostFormValue } from "@/types/board";
import { useRef, useState } from "react";

interface UseBoardPostFormParams {
  post?: TeamPost;
  canManage: boolean;
  onSave: (value: TeamPostFormValue) => Promise<boolean>;
  onClose: () => void;
}

export function useBoardPostForm({
  post,
  canManage,
  onSave,
  onClose,
}: UseBoardPostFormParams) {
  const showToast = useToastStore((state) => state.showToast);

  const [type, setType] = useState<PostType>(post?.type ?? "general");
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isPinned, setIsPinned] = useState(post?.isPinned ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const handleSave = async () => {
    if (isSavingRef.current) return;

    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();

    if (!normalizedTitle) {
      showToast("제목을 입력해 주세요.", "info");
      return;
    }

    if (!normalizedContent) {
      showToast("내용을 입력해 주세요.", "info");
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      const success = await onSave({
        type: canManage ? type : "general",
        title: normalizedTitle,
        content: normalizedContent,
        isPinned: canManage && isPinned,
      });

      if (!success) {
        showToast("게시물 저장에 실패했어요.", "error");
        return;
      }

      showToast(
        post ? "게시물이 수정됐어요." : "게시물이 등록됐어요.",
        "success",
      );

      onClose();
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  return {
    type,
    onChangeType: setType,
    title,
    onChangeTitle: setTitle,
    content,
    onChangeContent: setContent,
    isPinned,
    onChangeIsPinned: setIsPinned,
    isSaving,
    handleSave,
  };
}
