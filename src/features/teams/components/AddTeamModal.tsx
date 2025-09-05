import { Modal } from "@/shared/ui/modal";
import { teamSchema, type AddTeamFormData } from "../schemas/teams.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/shared/components/InputField";
import InviteMembersInput from "./InviteMembersInput";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";

type AddTeamModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (data: AddTeamFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  defaultValues?: Partial<AddTeamFormData>;
  forceAction?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function AddTeamModal({
  open,
  onOpenChange,
}: AddTeamModalProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data: AddTeamFormData) => {
    console.log("data", data);
  };

  console.log("errors", errors);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Team">
      <form
        id="add-team-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <InputField
          error={errors.name}
          register={register}
          htmlFor="name"
          label="Team Name"
        />
        <InputField
          error={errors.description}
          register={register}
          htmlFor="description"
          label="Description"
        />
        <FormField
          label="Invite Members"
          htmlFor="members"
          error={errors.members}
        >
          <Controller
            name="members"
            control={control}
            render={({ field }) => (
              <InviteMembersInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Search or type emails..."
              />
            )}
          />
        </FormField>
        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </Modal>
  );
}
