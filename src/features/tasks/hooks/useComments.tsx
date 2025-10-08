import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getComments,
} from "../services/tasks.service";
import type { CommentType, CreateCommentPayload } from "../types/tasks";

export const useComments = (taskId: string | undefined) => {
  const [commentText, setCommentText] = useState("");
  const [deletingComment, setDeletingComment] = useState<CommentType | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<CommentType[]>({
    queryKey: ["comments", taskId],
    queryFn: () => getComments({ taskId }),
    enabled: !!taskId,
  });

  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      }
      setCommentText("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteComment(commentId),
    onSuccess: () => {
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      }
      setDeletingComment(null);
    },
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !taskId) return;

    const commentData: CreateCommentPayload = {
      taskId,
      content: commentText.trim(),
    };

    await createMutation.mutateAsync(commentData);
  };

  const handleDeleteClick = (comment: CommentType) => {
    setDeletingComment(comment);
  };

  const handleDelete = async () => {
    if (!deletingComment?.id) return;
    await deleteMutation.mutateAsync({ commentId: deletingComment.id });
  };

  const cancelDelete = () => {
    setDeletingComment(null);
  };

  return {
    comments,
    isLoading,
    commentText,
    setCommentText,
    deletingComment,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleAdd,
    handleDeleteClick,
    handleDelete,
    cancelDelete,
  };
};
