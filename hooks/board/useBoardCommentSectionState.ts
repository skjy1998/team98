import { useConfirmStore } from "@/stores/confirm-store";
import { useToastStore } from "@/stores/toast-store";
import type { TeamPostComment } from "@/types/board";
import { type SubmitEvent, useId, useRef, useState } from "react";

interface UseBoardCommentSectionStateParams {
  onCreate: (content: string) => Promise<boolean>;
  onUpdate: (commentId: string, content: string) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
}

export function useBoardCommentSectionState({
  onCreate,
  onUpdate,
  onDelete,
}: UseBoardCommentSectionStateParams) {
  const showToast = useToastStore((state) => state.showToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);

  const isSubmittingRef = useRef(false);

  const commentsContentId = useId();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedContent = content.trim();

    if (!normalizedContent || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await onCreate(normalizedContent);

      if (!success) {
        showToast("댓글 등록에 실패했어요.", "error");
        return;
      }

      setContent("");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment: TeamPostComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async () => {
    const normalizedContent = editingContent.trim();

    if (!editingCommentId || !normalizedContent || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await onUpdate(editingCommentId, normalizedContent);

      if (!success) {
        showToast("댓글 수정에 실패했어요.", "error");
        return;
      }

      handleCancelEdit();
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (isSubmittingRef.current) return;

    const confirmed = await confirm({
      title: "댓글 삭제",
      description: "이 댓글을 삭제할까요? 삭제 후에는 되돌릴 수 없어요.",
      confirmLabel: "삭제",
      variant: "danger",
    });

    if (!confirmed) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const success = await onDelete(commentId);

      if (!success) {
        showToast("댓글 삭제에 실패했어요.", "error");
        return;
      }

      showToast("댓글을 삭제했어요.", "success");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    content,
    onChangeContent: setContent,
    editingCommentId,
    editingContent,
    onChangeEditingContent: setEditingContent,
    isSubmitting,
    isCommentsOpen,
    commentsContentId,
    handleToggleComments: () => setIsCommentsOpen((current) => !current),
    handleSubmit,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
  };
}
