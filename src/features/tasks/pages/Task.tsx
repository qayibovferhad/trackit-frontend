import { useCallback, useState } from "react";
import { Loader2,  } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../services/tasks.service";
import type { CreateTaskPayload, TaskType } from "../types/tasks";
import TaskModal from "../components/task/TaskModal";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import TaskItem from "../components/task/TaskItem";
import { CommentsSection } from "../components/comments/CommentsSection";
import SubtaskList from "../components/task/SubtaskList";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);

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
          <SubtaskList subtasks={subtasks} onEdit={handleEditTask} onDelete={handleDeleteTaskClick} setOpenModal={() => {
            setModals((prev) => ({ ...prev, subtask: true }))
          }} />
          <CommentsSection taskId={id} />
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
          title={`Delete this ${deletingTask.parentTaskId ? "subtask" : "task"
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
