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
import type { UserOption } from "../../types/tasks";
import { searchUsers } from "@/features/teams/services/teams.service";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import { useMutation } from "@tanstack/react-query";
import { createTask } from "../../services/tasks.service";
import { useState } from "react";
import { getErrorMessage } from "@/shared/lib/error";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
type TaskModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultColumnId: string | null;
};
const isValidAssignee = (assignee: any): assignee is Required<AssigneeData> => {
  return (
    assignee &&
    typeof assignee.id === "string" &&
    typeof assignee.email === "string"
  );
};

async function fetchUserOptions(input: string): Promise<UserOption[]> {
  if (!input || input.length < 2) return [];

  try {
    const data = await searchUsers(input);

    return (data?.items ?? []).map((user: any) => ({
      id: user.id,
      label: user.email || user.username,
      value: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    }));
  } catch (error) {
    return [];
  }
}

export default function TaskModal({
  open,
  onOpenChange,
  defaultColumnId,
}: TaskModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    unregister,
    formState: { errors },
  } = useZodForm(taskSchema);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (err) => {
      setErrorMessage(getErrorMessage(err));
    },
  });
  const assigneeValue = watch("assignee");

  const handleAssigneeChange = (selectedUsers: UserOption[]) => {
    const selectedUser = selectedUsers[0] || null;

    if (selectedUser) {
      const assigneeData: AssigneeData = {
        id: selectedUser.id,
        email: selectedUser.email,
        username: selectedUser.username,
        name: selectedUser.name,
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
            label:
              assigneeValue.email ||
              assigneeValue.username ||
              assigneeValue.name ||
              "Unknown User",
            value: assigneeValue.id,
            email: assigneeValue.email,
            username: assigneeValue.username,
            name: assigneeValue.name,
          },
        ]
      : [];
  async function onSubmit(data: TaskFormData) {
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
    };

    await mutateAsync(payload);
  }

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
            loadOptions={fetchUserOptions}
            formatCreateLabel={(s) => `Invite "${s}"`}
            allowCreateOption={false}
            getNewOptionData={(inputValue) => ({
              label: inputValue,
              value: inputValue.trim(),
            })}
            noOptionsMessage={() => "No users found"}
          />
        </FormField>
        {errorMessage && <ErrorAlert message={errorMessage} />}

        <Button type="submit" className="w-full">
          {isPending ? "Creating.." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
