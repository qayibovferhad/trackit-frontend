import { useState } from "react";
import {
  Calendar,
  Tag,
  MoreHorizontal,
  Plus,
  UserPlus,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import UserAvatar from "@/shared/components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../services/tasks.service";
import type { CreateTaskPayload, TaskType } from "../types/tasks";
import { formatDate } from "@/shared/utils/date";
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

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery<TaskType | null>({
    queryKey: ["task", id],
    queryFn: () => getTask({ taskId: id }),
    enabled: !!id,
  });

  const [comments] = useState([
    {
      id: 1,
      author: "Juliana Mills",
      avatar: "https://i.pravatar.cc/150?img=1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      time: "10 mins ago",
    },
    {
      id: 2,
      author: "Jonathan James",
      avatar: "https://i.pravatar.cc/150?img=2",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      time: "2hours ago",
    },
  ]);

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
                      name={comment.avatar}
                      src={comment.avatar}
                      size="md"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="rounded-lg p-3">
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 px-3">
                      <span className="font-medium text-violet-500">
                        By {comment.author}
                      </span>
                      <span>•</span>
                      <span>{comment.time}</span>
                    </div>
                  </div>

                  <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="You"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Write your comments..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
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
    </>
  );
}
