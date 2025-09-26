import { useZodForm } from "@/shared/hooks/useZodForm";
import { Modal } from "@/shared/ui/modal";
import { taskSchema, type TaskFormData } from "../../schemas/tasks.schema";
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/ui/button";
type TaskModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultColumnId: string | null;
};

export default function TaskModal({
  open,
  onOpenChange,
  defaultColumnId,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useZodForm(taskSchema);

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

        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </Modal>
  );
}
