import { Modal } from "@/shared/ui/modal";
import { teamSchema, type AddTeamFormData } from "../schemas/teams.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/shared/components/InputField";
import InviteMembersInput from "./InviteMembersInput";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
import { createTeam } from "../services/teams.service";
import { useMutation } from "@tanstack/react-query";

type AddTeamModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultValues?: Partial<AddTeamFormData>;
};

export default function AddTeamModal({
  open,
  onOpenChange,
}: AddTeamModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
  });

  const {
    mutateAsync: addTeam,
    error,
    isPending,
    isError,
    reset: createTeamReset,
  } = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {},
  });
  const onSubmit = async (data: AddTeamFormData) => {
    try {
      await addTeam(data);

      reset();
      onOpenChange(false);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open && !isPending) {
      reset();

      createTeamReset();
    }
    onOpenChange(open);
  };

  return (
    <Modal open={open} onOpenChange={handleModalClose} title="Create Team">
      <form
        id="add-team-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error?.message}</p>
          </div>
        )}
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
          error={
            Array.isArray(errors.members)
              ? errors.members.find(Boolean)
              : errors.members
          }
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
