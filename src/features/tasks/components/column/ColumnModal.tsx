import { Modal } from "@/shared/ui/modal";
import { columnSchema, type ColumnFormData } from "../../schemas/boards.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { InputField } from "@/shared/components/InputField";
import ColorSelect from "./ColorSelect";
import { Button } from "@/shared/ui/button";

interface ColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ColumnFormData) => void;
  defaultValues?: ColumnFormData;
}
export default function ColumnModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: ColumnModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useZodForm(columnSchema, {
    defaultValues: defaultValues || {
      title: "",
      color: "gray",
    },
  });

  const selectedColor = watch("color");

  const handleFormSubmit = (data: ColumnFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };
  return (
    <Modal open={open} onOpenChange={handleClose} title="Edit Column">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <InputField
          label="Column title"
          htmlFor="title"
          register={register}
          error={errors.title}
        />

        <ColorSelect
          selectedColor={selectedColor}
          onClick={(color) => setValue("color", color)}
        />

        <Button className="w-full">Edit</Button>
      </form>
    </Modal>
  );
}
