import { Loader2 } from "lucide-react";
import type { CommentType } from "../../types/tasks";

import { MessageSquare } from "lucide-react";
import CommentItem from "./CommentItem";

const EmptyComments = () => (
  <div className="text-center py-8 text-gray-500">
    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
    <p className="text-sm">No comments yet</p>
    <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
  </div>
);

interface CommentsListProps {
  comments: CommentType[];
  isLoading: boolean;
  currentUserId?: string;
  onDeleteClick: (comment: CommentType) => void;
}

export const CommentsList = ({
  comments,
  isLoading,
  currentUserId,
  onDeleteClick,
}: CommentsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (comments.length === 0) {
    return <EmptyComments />;
  }

  return (
    <div className="space-y-4 mb-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDeleteClick}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};
