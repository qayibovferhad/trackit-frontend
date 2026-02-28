import { useEffect, useState } from "react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { Modal } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { getErrorMessage } from "@/shared/lib/error";
import { taskSchema, type TaskFormData, type AssigneeData } from "../../schemas/tasks.schema";
import { useBoardState } from "../../hooks/useBoardState";
import type { CreateTaskPayload, TaskPriority, TaskType, TeamOption, UserOption } from "../../types/tasks";
import type { Column } from "../../types/boards";
import type { User } from "@/features/auth/types/auth.type";
import TaskBasicFields from "./TaskBasicFields";
import TaskAssigneeField from "./TaskAssigneeField";
import TaskTeamBoardColumn from "./TaskTeamBoardColumn";
import TaskTagsField from "./TaskTagsField";

type TaskModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  parentTaskId?: string;
  defaultColumnId?: string | null;
  defaultUser?: User | null;
  onAddTask?: (taskData: CreateTaskPayload) => void;
  onEditTask?: (taskId: string, taskData: CreateTaskPayload) => void;
  teamId?: string;
  editingTask?: TaskType | null;
};

const isValidAssignee = (assignee: any): assignee is Required<AssigneeData> =>
  assignee && typeof assignee.id === "string" && typeof assignee.email === "string";

export default function TaskModal({
  open,
  onOpenChange,
  defaultColumnId,
  defaultUser,
  onAddTask,
  teamId,
  parentTaskId,
  editingTask,
  onEditTask,
}: TaskModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeamOption, setSelectedTeamOption] = useState<TeamOption | null>(null);
  const [columnsOptions, setColumnsOptions] = useState<Column[] | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, unregister, formState: { errors }, reset } =
    useZodForm(taskSchema);

  const assigneeValue = watch("assignee");
  const tagsValue = watch("tags") as string[] | undefined;
  const selectedTeam = watch("team");
  const { boards, boardsLoading } = useBoardState(selectedTeam);

  useEffect(() => {
    if (open && editingTask) {
      setValue("title", editingTask.title);
      setValue("description", editingTask.description || "");

      if (editingTask.dueAt) {
        const d = new Date(editingTask.dueAt);
        setValue("dueDate" as keyof TaskFormData, d.toISOString().split("T")[0]);
        setValue("dueTime", `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
      }
      if (editingTask.priority && ["low", "medium", "high"].includes(editingTask.priority)) {
        setValue("priority", editingTask.priority as TaskPriority);
      }
      if (editingTask.assignee) {
        setValue("assignee", {
          id: editingTask.assignee.id,
          email: editingTask.assignee.email,
          username: editingTask.assignee.username,
          profileImage: editingTask.assignee.profileImage,
        });
      }
      if (editingTask.tags?.length) {
        setValue("tags", editingTask.tags);
      }
    } else if (open && !editingTask) {
      reset();
    }

    if (!open) {
      setSelectedTeamOption(null);
      setColumnsOptions(null);
      setSelectedColumnId(null);
      setErrorMessage(null);
    }
  }, [open, editingTask, setValue, reset]);


  const currentAssignee: UserOption[] =
    assigneeValue && isValidAssignee(assigneeValue)
      ? [{ id: assigneeValue.id, value: assigneeValue.id, label: assigneeValue.username || "Unknown User", email: assigneeValue.email }]
      : [];

  const currentTags = (tagsValue ?? []).map((t) => ({ label: t, value: t }));

  const handleAssigneeChange = (selectedUsers: UserOption[]) => {
    const user = selectedUsers[0] || null;
    if (user) {
      setValue("assignee", { id: user.id, email: user.email, username: user.username, profileImage: user.profileImage });
    } else {
      unregister("assignee");
    }
  };

  const handleTeamChange = (selectedTeams: TeamOption[]) => {
    const team = selectedTeams[0];
    setColumnsOptions(null);
    setSelectedColumnId(null);
    if (team) {
      setValue("team", team.id);
      setSelectedTeamOption(team);
    } else {
      setValue("team", "");
      setSelectedTeamOption(null);
    }
  };

  const handleTagsChange = (selected: { label: string; value: string }[]) => {
    setValue("tags", selected?.map((s) => s.value) ?? []);
  };

  async function onSubmit(data: TaskFormData) {
    if (!parentTaskId && !defaultColumnId && !selectedColumnId) {
      setErrorMessage("No column selected");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      let dueAt: Date | undefined;
      if (data.dueDate) {
        const date = new Date(data.dueDate);
        if (data.dueTime) {
          const [hh, mm] = data.dueTime.split(":").map(Number);
          date.setHours(hh, mm, 0, 0);
        } else {
          date.setHours(0, 0, 0, 0);
        }
        dueAt = date;
      }

      const payload: CreateTaskPayload = {
        title: data.title,
        description: data.description,
        dueAt,
        assignee: isValidAssignee(data.assignee) ? data.assignee : undefined,
        priority: data.priority,
        columnId: (selectedColumnId || defaultColumnId) ?? undefined,
        teamId: (selectedTeam || teamId) ?? undefined,
        parentTaskId,
        tags: data.tags || [],
      };

      if (editingTask && onEditTask) {
        onEditTask(editingTask.id, payload);
      } else if (onAddTask) {
        onAddTask(payload);
      }

      onOpenChange(false);
      reset();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const getModalTitle = () => {
    if (editingTask) return "Edit Task";
    if (parentTaskId) return "Create Subtask";
    return "Create Task";
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={getModalTitle()}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5">
        <TaskBasicFields register={register} errors={errors} isSubtask={!!parentTaskId} />

        {defaultUser && (
          <TaskTeamBoardColumn
            defaultUserId={defaultUser.id}
            selectedTeamOption={selectedTeamOption}
            boards={boards}
            boardsLoading={boardsLoading}
            columnsOptions={columnsOptions}
            onTeamChange={handleTeamChange}
            onBoardChange={(b) => { setColumnsOptions(b?.columns || null); setSelectedColumnId(null); }}
            onColumnChange={(c) => setSelectedColumnId(c?.value || null)}
          />
        )}

        <TaskAssigneeField
          value={currentAssignee}
          onChange={handleAssigneeChange}
          teamId={defaultUser ? selectedTeam : teamId}
          isDisabled={defaultUser ? !selectedTeam : false}
          error={Array.isArray(errors.assignee) ? errors.assignee.find(Boolean) : errors.assignee}
        />

        <TaskTagsField value={currentTags} onChange={handleTagsChange} error={errors.tags as any} />

        {errorMessage && <ErrorAlert message={errorMessage} />}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (editingTask ? "Updating..." : "Creating...") : (editingTask ? "Update" : "Create")}
        </Button>
      </form>
    </Modal>
  );
}
