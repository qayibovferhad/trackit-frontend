import { InputField } from "@/shared/components/InputField";
import { FormField } from "@/shared/components/FormField";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { TaskFormData } from "../../schemas/tasks.schema";

type Props = {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  isSubtask: boolean;
};

export default function TaskBasicFields({ register, errors, isSubtask }: Props) {
  return (
    <>
      <InputField
        label={isSubtask ? "Subtask Name" : "Task Name"}
        htmlFor="title"
        register={register}
        error={errors.title}
      />

      {!isSubtask && (
        <InputField
          label="Description"
          htmlFor="description"
          register={register}
          error={errors.description}
        />
      )}

      <div className="flex gap-2">
        <FormField label="Due Date" htmlFor="dueDate" error={errors.dueDate} className="flex-1">
          <input
            type="date"
            id="date"
            {...register("dueDate")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </FormField>
        <FormField label="Due Time" htmlFor="dueTime" error={errors.dueTime} className="flex-1">
          <input
            type="time"
            id="dueTime"
            {...register("dueTime")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </FormField>
      </div>

      {!isSubtask && (
        <FormField label="Priority" htmlFor="priority" error={errors.priority}>
          <select
            id="priority"
            {...register("priority")}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            defaultValue="medium"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormField>
      )}
    </>
  );
}
