import { useState } from "react";
import {
  Calendar,
  Tag,
  MoreHorizontal,
  Plus,
  UserPlus,
  Trash2,
  Edit2,
  Send,
} from "lucide-react";
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
import { formatDate, timeAgo } from "@/shared/utils/date";
import { randomColors } from "@/shared/constants/colors";
import TaskModal from "../components/task/TaskModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuRow,
} from "@/shared/ui/dropdown-menu";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useUserStore } from "@/stores/userStore";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();

  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [deletingComment, setDeletingComment] = useState<CommentType | null>(
    null
  );
  const [confirmDeleteCommentOpen, setConfirmDeleteCommentOpen] =
    useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery<TaskType | null>({
    queryKey: ["task", id],
    queryFn: () => getTask({ taskId: id }),
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery<CommentType[]>({
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

  const handleAddSubtask = async (subtaskData: CreateTaskPayload) => {
    await createTaskMutation.mutateAsync(subtaskData);
  };

  const handleEditTask = (task: TaskType) => {
    setEditingTask(task);
    setOpenTaskModal(true);
  };

  const handleUpdateTask = async (
    taskId: string,
    taskData: CreateTaskPayload
  ) => {
    await updateTaskMutation.mutateAsync({ taskId, data: taskData });
  };

  const handleDeleteTask = async () => {
    if (!deletingTask?.id) return;
    await deleteTaskMutation.mutateAsync({ taskId: deletingTask?.id });
    if (deletingTask?.parentTaskId) {
      setConfirmDeleteOpen(false);
    } else {
      navigate(`/boards/${deletingTask?.teamId}`);
    }
  };

  const handleConfirmModalOpenChange = (open: boolean) => {
    setConfirmDeleteOpen(open);
    if (!open) {
      setDeletingTask(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    const commentData: CreateCommentPayload = {
      taskId: id,
      content: commentText.trim(),
    };

    await createCommentMutation.mutateAsync(commentData);
  };

  const handleDeleteComment = async () => {
    if (!deletingComment?.id) return;
    await deleteCommentMutation.mutateAsync({
      commentId: deletingComment.id,
    });
    setConfirmDeleteCommentOpen(false);
  };

  const handleConfirmDeleteCommentOpenChange = (open: boolean) => {
    setConfirmDeleteCommentOpen(open);
    if (!open) {
      setDeletingComment(null);
    }
  };
  const subtasks = data?.subtasks ?? [];

  return (
    <>
      <div className="min-h-screen p-3">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h1 className="text-base font-semibold text-gray-700 mb-3">
                  {data?.title}
                </h1>
                <p className="text-sm text-gray-600">{data?.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(data?.dueAt)}</span>
                  </div>
                  {data?.tags && data?.tags.length ? (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <div className="flex gap-2">
                        {data?.tags.map((tag) => {
                          const randomColor =
                            randomColors[
                              Math.floor(Math.random() * randomColors.length)
                            ];

                          return (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded text-sm ${randomColor}`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-sm bg-red-200 text-red-800`}
                    >
                      No Tag
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">Created By</span>
                    <span className="font-medium text-violet-500">
                      {data?.assignee.name || data?.assignee.username}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-7">
                  <DropdownMenuRow
                    iconCircle
                    icon={<Edit2 />}
                    label="Edit"
                    iconSize={4}
                    onClick={() => data && handleEditTask(data)}
                  />
                  <DropdownMenuRow
                    iconCircle
                    icon={<Trash2 />}
                    label="Delete"
                    iconSize={4}
                    onClick={() => {
                      if (data) setDeletingTask(data);
                      setConfirmDeleteOpen(true);
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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
                onClick={() => setSubtaskModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Sub Task
              </Button>
            </div>

            <div className="space-y-3">
              {subtasks.map((subtask) => {
                return (
                  <div
                    key={subtask.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">
                        {subtask.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(subtask.dueAt)}</span>
                        </div>
                        {subtask?.tags && subtask?.tags.length ? (
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4" />
                            <div className="flex gap-2">
                              {subtask?.tags.map((tag) => {
                                const randomColor =
                                  randomColors[
                                    Math.floor(
                                      Math.random() * randomColors.length
                                    )
                                  ];

                                return (
                                  <span
                                    key={tag}
                                    className={`px-2 py-0.5 rounded text-sm ${randomColor}`}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-sm bg-red-200 text-red-800`}
                          >
                            No Tag
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">Created By</span>
                          <span className="font-medium text-violet-500">
                            {subtask?.assignee.name ||
                              subtask?.assignee.username}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-7">
                        <DropdownMenuRow
                          iconCircle
                          icon={<Edit2 />}
                          label="Edit"
                          iconSize={4}
                          onClick={() => handleEditTask(subtask)}
                        />
                        <DropdownMenuRow
                          iconCircle
                          icon={<Trash2 />}
                          label="Delete"
                          iconSize={4}
                          onClick={() => {
                            setConfirmDeleteOpen(true);
                            setDeletingTask(subtask);
                          }}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
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

            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-1 items-center group">
                  <div className="flex-shrink-0 mb-4">
                    <UserAvatar
                      name={comment.user?.name || comment.user?.username}
                      src={comment.user?.profileImage}
                      size="md"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="rounded-lg p-3">
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-2  text-xs text-gray-500 px-3">
                      <span className="font-medium text-violet-500">
                        By {comment.user.name || comment.user.username}
                      </span>
                      <span>•</span>
                      <span>{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-7">
                      <DropdownMenuRow
                        iconCircle
                        icon={<Trash2 />}
                        label="Delete"
                        iconSize={4}
                        onClick={() => {
                          setDeletingComment(comment);
                          setConfirmDeleteCommentOpen(true);
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-3">
              <UserAvatar
                name={user?.name || user?.username}
                src={user?.profileImage}
                size="md"
              />
              <div className="flex-1 relative flex gap-2">
                <input
                  type="text"
                  placeholder="Write your comments..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {subtaskModalOpen && (
        <TaskModal
          open={subtaskModalOpen}
          onOpenChange={setSubtaskModalOpen}
          defaultColumnId={null}
          onAddTask={handleAddSubtask}
          teamId={data?.teamId}
          parentTaskId={data?.id}
        />
      )}
      {openTaskModal && (
        <TaskModal
          open={openTaskModal}
          onOpenChange={(open) => {
            setOpenTaskModal(open);
            if (!open) setEditingTask(null);
          }}
          defaultColumnId={editingTask?.columnId || null}
          onEditTask={handleUpdateTask}
          teamId={data?.teamId}
          parentTaskId={editingTask?.parentTaskId}
          editingTask={editingTask}
        />
      )}

      {deletingTask && (
        <ConfirmModal
          open={confirmDeleteOpen}
          onOpenChange={handleConfirmModalOpenChange}
          title={`Delete this ${
            deletingTask?.parentTaskId ? "subtask" : "task"
          }?`}
          description={`"${deletingTask.title}" will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteTaskMutation.isPending}
          onConfirm={handleDeleteTask}
        />
      )}

      {deletingComment && (
        <ConfirmModal
          open={confirmDeleteCommentOpen}
          onOpenChange={handleConfirmDeleteCommentOpenChange}
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
