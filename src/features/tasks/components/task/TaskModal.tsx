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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useZodForm(taskSchema);

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
      setValue("assignee", undefined);
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
  async function onSubmit(data: TaskFormData) {}
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
            htmlFor="date"
            error={errors.date}
            className="flex-1"
          >
            <input
              type="date"
              id="date"
              {...register("date")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>

          <FormField
            label="Due Time"
            htmlFor="time"
            error={errors.time}
            className="flex-1"
          >
            <input
              type="time"
              id="time"
              {...register("time")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>
        </div>
        <FormField
          label="Assign To"
          htmlFor="assignee"
          error={errors.assignee?.email || errors.assignee?.root}
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
        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </Modal>
  );
}
