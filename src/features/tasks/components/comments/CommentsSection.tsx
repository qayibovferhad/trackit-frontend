import { useUserStore } from "@/stores/userStore";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useComments } from "../../hooks/useComments";
import { CommentsList } from "./CommentsList";
import { CommentForm } from "./CommentForm";

interface CommentsSectionProps {
  taskId: string | undefined;
}

export const CommentsSection = ({ taskId }: CommentsSectionProps) => {
  const { user } = useUserStore();
  const {
    comments,
    isLoading,
    commentText,
    setCommentText,
    deletingComment,
    isCreating,
    isDeleting,
    handleAdd,
    handleDeleteClick,
    handleDelete,
    cancelDelete,
  } = useComments(taskId);

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-800">Comments</h2>
          <p className="text-sm text-gray-500">
            This task comments from other members
          </p>
        </div>

        <CommentsList
          comments={comments}
          isLoading={isLoading}
          currentUserId={user?.id}
          onDeleteClick={handleDeleteClick}
        />

        <CommentForm
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleAdd}
          isSubmitting={isCreating}
          userName={user?.name || user?.username}
          userImage={user?.profileImage}
        />
      </div>

      {deletingComment && (
        <ConfirmModal
          open={!!deletingComment}
          onOpenChange={(open) => !open && cancelDelete()}
          title="Delete this comment?"
          description="This comment will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
