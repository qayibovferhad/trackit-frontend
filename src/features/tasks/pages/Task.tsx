import { useCallback, useState } from "react";
import { Plus, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import UserAvatar from "@/shared/components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  createTask,
  deleteComment,
  deleteTask,
  getComments,
  getTask,
  updateTask,
} from "../services/tasks.service";
import type {
  CommentType,
  CreateCommentPayload,
  CreateTaskPayload,
  TaskType,
} from "../types/tasks";
import TaskModal from "../components/task/TaskModal";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useUserStore } from "@/stores/userStore";
import TaskItem from "../components/task/TaskItem";
import CommentItem from "../components/task/CommentItem";

const EmptySubtasks = () => (
  <div className="text-center py-8 text-gray-500">
    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
    <p className="text-sm">No subtasks yet</p>
    <p className="text-xs text-gray-400 mt-1">
      Add your first subtask to get started
    </p>
  </div>
);

const EmptyComments = () => (
  <div className="text-center py-8 text-gray-500">
    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
    <p className="text-sm">No comments yet</p>
    <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
  </div>
);

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();

  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);
  const [commentText, setCommentText] = useState("");
  const [deletingComment, setDeletingComment] = useState<CommentType | null>(
    null
  );

  const [modals, setModals] = useState({
    subtask: false,
    editTask: false,
    deleteTask: false,
    deleteComment: false,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: task,
    isLoading: isLoadingTask,
    error: taskError,
  } = useQuery<TaskType | null>({
    queryKey: ["task", id],
    queryFn: () => getTask({ taskId: id }),
    enabled: !!id,
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery<
    CommentType[]
  >({
    queryKey: ["comments", id],
    queryFn: () => getComments({ taskId: id }),
    enabled: !!id,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: CreateTaskPayload;
    }) => updateTask(taskId, data),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["task", id] });
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => deleteTask(taskId),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["task", id] });
      setEditingTask(null);
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setCommentText("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string }) =>
      deleteComment(commentId),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setDeletingComment(null);
    },
  });

  const handleEditTask = useCallback((taskToEdit: TaskType) => {
    setEditingTask(taskToEdit);
    setModals((prev) => ({ ...prev, editTask: true }));
  }, []);

  const handleDeleteTaskClick = useCallback((taskToDelete: TaskType) => {
    setDeletingTask(taskToDelete);
    setModals((prev) => ({ ...prev, deleteTask: true }));
  }, []);

  const handleDeleteTask = useCallback(async () => {
    if (!deletingTask?.id) return;
    await deleteTaskMutation.mutateAsync({ taskId: deletingTask.id });

    if (deletingTask.parentTaskId) {
      setModals((prev) => ({ ...prev, deleteTask: false }));
      setDeletingTask(null);
    } else {
      navigate(`/boards/${deletingTask.teamId}`);
    }
  }, [deletingTask, deleteTaskMutation, navigate]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    const commentData: CreateCommentPayload = {
      taskId: id,
      content: commentText.trim(),
    };

    await createCommentMutation.mutateAsync(commentData);
  };

  const handleDeleteCommentClick = useCallback((comment: CommentType) => {
    setDeletingComment(comment);
    setModals((prev) => ({ ...prev, deleteComment: true }));
  }, []);

  const handleDeleteComment = useCallback(async () => {
    if (!deletingComment?.id) return;
    await deleteCommentMutation.mutateAsync({ commentId: deletingComment.id });
  }, [deletingComment, deleteCommentMutation]);

  const subtasks = task?.subtasks ?? [];

  if (isLoadingTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (taskError || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load task</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-3">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          {task && (
            <TaskItem
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTaskClick}
            />
          )}

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Subtasks
                </h2>
                <p className="text-sm text-gray-500">
                  You can add subtasks and assign to others
                </p>
              </div>
              <Button
                variant="violet"
                onClick={() =>
                  setModals((prev) => ({ ...prev, subtask: true }))
                }
              >
                <Plus className="w-4 h-4" />
                Add Subtask
              </Button>
            </div>

            {subtasks.length === 0 ? (
              <EmptySubtasks />
            ) : (
              <div className="space-y-3">
                {subtasks.map((subtask) => (
                  <TaskItem
                    key={subtask.id}
                    task={subtask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTaskClick}
                    isSubtask
                  />
                ))}
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                Comments
              </h2>
              <p className="text-sm text-gray-500">
                This task comments from other members
              </p>
            </div>

            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : comments.length === 0 ? (
              <EmptyComments />
            ) : (
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteCommentClick}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} className="flex gap-3">
              <UserAvatar
                name={user?.name || user?.username}
                src={user?.profileImage}
                size="md"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                  disabled={createCommentMutation.isPending}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {modals.subtask && (
        <TaskModal
          open={modals.subtask}
          onOpenChange={(open) =>
            setModals((prev) => ({ ...prev, subtask: open }))
          }
          defaultColumnId={null}
          onAddTask={(data) => createTaskMutation.mutateAsync(data)}
          teamId={task?.teamId}
          parentTaskId={task?.id}
        />
      )}

      {modals.editTask && editingTask && (
        <TaskModal
          open={modals.editTask}
          onOpenChange={(open) => {
            setModals((prev) => ({ ...prev, editTask: open }));
            if (!open) setEditingTask(null);
          }}
          defaultColumnId={editingTask.columnId || null}
          onEditTask={(taskId, data) =>
            updateTaskMutation.mutateAsync({ taskId, data })
          }
          teamId={task?.teamId}
          parentTaskId={editingTask.parentTaskId}
          editingTask={editingTask}
        />
      )}

      {modals.deleteTask && deletingTask && (
        <ConfirmModal
          open={modals.deleteTask}
          onOpenChange={(open) => {
            setModals((prev) => ({ ...prev, deleteTask: open }));
            if (!open) setDeletingTask(null);
          }}
          title={`Delete this ${
            deletingTask.parentTaskId ? "subtask" : "task"
          }?`}
          description={`"${deletingTask.title}" will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteTaskMutation.isPending}
          onConfirm={handleDeleteTask}
        />
      )}

      {modals.deleteComment && deletingComment && (
        <ConfirmModal
          open={modals.deleteComment}
          onOpenChange={(open) => {
            setModals((prev) => ({ ...prev, deleteComment: open }));
            if (!open) setDeletingComment(null);
          }}
          title="Delete this comment?"
          description="This comment will be permanently deleted."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteCommentMutation.isPending}
          onConfirm={handleDeleteComment}
        />
      )}
    </>
  );
}
