import { useZodForm } from "@/shared/hooks/useZodForm";
import { Modal } from "@/shared/ui/modal";
import {
  taskSchema,
  type TaskFormData,
  type AssigneeData,
} from "../../schemas/tasks.schema";
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/components/FormField";
import type { CreateTaskPayload, UserOption } from "../../types/tasks";
import { getTeamMembers } from "@/features/teams/services/teams.service";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import { useState } from "react";
import { getErrorMessage } from "@/shared/lib/error";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
type TaskModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  parentTaskId?: string;
  defaultColumnId: string | null;
  onAddTask?: (taskData: CreateTaskPayload) => void;
  teamId?: string;
};
const isValidAssignee = (assignee: any): assignee is Required<AssigneeData> => {
  return (
    assignee &&
    typeof assignee.id === "string" &&
    typeof assignee.email === "string"
  );
};

async function fetchUserOptions(
  teamId: string,
  input: string
): Promise<UserOption[]> {
  if (!input || input.length < 2) return [];

  try {
    const data = await getTeamMembers(teamId, input);

    return (data ?? []).map((member: any) => {
      const user = member.user;
      return {
        id: user.id,
        value: user.id,
        label: user.username || user.email,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      };
    });
  } catch (error) {
    return [];
  }
}

async function fetchTagOptions(teamId: string, input: string) {
  if (!input || input.length < 1) return [];
  return [];
}

type TagOption = { label: string; value: string };

export default function TaskModal({
  open,
  onOpenChange,
  defaultColumnId,
  onAddTask,
  teamId,
  parentTaskId,
}: TaskModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    unregister,
    formState: { errors },
    reset,
  } = useZodForm(taskSchema);

  const assigneeValue = watch("assignee");
  const tagsValue = watch("tags") as string[] | undefined;

  const handleAssigneeChange = (selectedUsers: UserOption[]) => {
    const selectedUser = selectedUsers[0] || null;

    if (selectedUser) {
      const assigneeData: AssigneeData = {
        id: selectedUser.id,
        email: selectedUser.email,
        username: selectedUser.username,
        profileImage: selectedUser.profileImage,
      };
      setValue("assignee", assigneeData);
    } else {
      unregister("assignee");
    }
  };

  const currentAssignee: UserOption[] =
    assigneeValue && isValidAssignee(assigneeValue)
      ? [
          {
            id: assigneeValue.id,
            label: assigneeValue.username || "Unknown User",
            value: assigneeValue.id,
            email: assigneeValue.email,
          },
        ]
      : [];
  async function onSubmit(data: TaskFormData) {
    if (!parentTaskId && !defaultColumnId) {
      setErrorMessage("No column selected");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const [hh, mm] = data.dueTime.split(":").map(Number);
      const dueAt = new Date(data.dueDate);
      dueAt.setHours(hh, mm, 0, 0);

      const payload = {
        title: data.title,
        description: data.description,
        dueAt,
        assignee: isValidAssignee(data.assignee) ? data.assignee : undefined,
        priority: data.priority,
        columnId: defaultColumnId ?? undefined,
        teamId: teamId ?? undefined,
        parentTaskId: parentTaskId,
        tags: data.tags || [],
      };

      if (onAddTask) {
        onAddTask(payload);
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTagsChange = (selected: TagOption[] | null) => {
    if (!selected || selected.length === 0) {
      setValue("tags", []);
      return;
    }
    const tags = selected.map((s) => s.value);
    setValue("tags", tags);
  };
  const currentTags = (tagsValue ?? []).map((t) => ({ label: t, value: t }));
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Board Task">
      <form
        id="add-task-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 pl-5 pr-5"
      >
        <InputField
          label="Task Name"
          htmlFor="title"
          register={register}
          error={errors.title}
        />
        <InputField
          label="Description"
          htmlFor="description"
          register={register}
          error={errors.description}
        />

        <div className="flex gap-2">
          <FormField
            label="Due Date"
            htmlFor="dueDate"
            error={errors.dueDate}
            className="flex-1"
          >
            <input
              type="date"
              id="date"
              {...register("dueDate")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>

          <FormField
            label="Due Time"
            htmlFor="dueTime"
            error={errors.dueTime}
            className="flex-1"
          >
            <input
              type="time"
              id="dueTime"
              {...register("dueTime")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>
        </div>
        <FormField label="Priority" htmlFor="priority" error={errors.priority}>
          <select
            id="priority"
            {...register("priority")}
            className="w-full border border-gray-300 r rounded-md p-2 text-sm "
            defaultValue="medium"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>
        <FormField
          label="Assign To"
          htmlFor="assignee"
          error={
            Array.isArray(errors.assignee)
              ? errors.assignee.find(Boolean)
              : errors.assignee
          }
        >
          <GenericAsyncSelect<UserOption>
            value={currentAssignee}
            onChange={handleAssigneeChange}
            placeholder="Search by email or username..."
            loadOptions={(input) => fetchUserOptions(teamId || "", input)}
            formatCreateLabel={(s) => `Invite "${s}"`}
            allowCreateOption={false}
            getNewOptionData={(inputValue) => ({
              label: inputValue,
              value: inputValue.trim(),
            })}
            noOptionsMessage={() => "No users found"}
          />
        </FormField>

        <FormField label="Tags" htmlFor="tags" error={errors.tags as any}>
          <GenericAsyncSelect<TagOption>
            value={currentTags}
            onChange={(opts) => handleTagsChange(opts as TagOption[])}
            placeholder="Add or select tags..."
            loadOptions={(input) => fetchTagOptions(teamId || "", input)}
            allowCreateOption={true}
            formatCreateLabel={(s) => `Create tag "${s}"`}
            getNewOptionData={(inputValue) => ({
              label: inputValue,
              value: inputValue.trim(),
            })}
            noOptionsMessage={() => "No tags"}
          />
        </FormField>
        {errorMessage && <ErrorAlert message={errorMessage} />}

        <Button type="submit" className="w-full">
          {isSubmitting ? "Creating.." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
