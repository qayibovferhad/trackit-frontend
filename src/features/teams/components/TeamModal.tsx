import { Modal } from "@/shared/ui/modal";
import { teamSchema, type AddTeamFormData } from "../schemas/teams.schema";
import { Controller } from "react-hook-form";
import { InputField } from "@/shared/components/InputField";
import InviteMembersInput from "./InviteMembersInput";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
import { createTeam, updateTeam } from "../services/teams.service";
import { useMutation } from "@tanstack/react-query";
import { useZodForm } from "@/shared/hooks/useZodForm";
import type { Team } from "../types";
import { useEffect } from "react";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { getErrorMessage } from "@/shared/lib/error";

type TeamModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
  team?: Team | null;
  defaultValues?: Partial<AddTeamFormData>;
};

export default function TeamModal({
  open,
  onOpenChange,
  onSaved,
  team = null,
  defaultValues = {},
}: TeamModalProps) {
  const isEditMode = Boolean(team);

  const initialValues: Partial<AddTeamFormData> = isEditMode
    ? {
        name: team?.name,
        description: team?.description ?? "",
      }
    : defaultValues;
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(teamSchema, { defaultValues: initialValues });

  const {
    mutateAsync: createTeamMutate,
    error: createError,
    isPending: isCreating,
    reset: createReset,
  } = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      createReset();
      onSaved?.();
      onOpenChange(false);
      reset();
    },
  });

  const {
    mutateAsync: updateTeamMutate,
    error: updateError,
    isPending: isUpdating,
    reset: updateReset,
  } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddTeamFormData }) =>
      updateTeam(id, payload),
    onSuccess: () => {
      updateReset();
      onSaved?.();
      onOpenChange(false);
      reset();
    },
  });

  const isPending = isCreating || isUpdating;
  const error = createError ?? updateError;

  const onSubmit = async (data: AddTeamFormData) => {
    try {
      if (isEditMode && team) {
        await updateTeamMutate({ id: team.id, payload: data });
      } else {
        await createTeamMutate(data);
      }
    } catch (err) {
      console.error("Team save error", err);
    }
  };

  const handleModalClose = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      reset();
      createReset();
      updateReset();
    }
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (open) {
      if (isEditMode && team) {
        reset({
          name: team.name ?? "",
          description: team.description ?? "",
          members: undefined,
        });
      } else {
        reset({
          name: "",
          description: "",
          members: [],
        });
      }
    } else {
      reset({
        name: "",
        description: "",
        members: [],
      });
      createReset();
      updateReset();
    }
  }, [open, team]);

  const modalTitle = isEditMode ? "Edit Team" : "Create New Team";
  const submitButtonText = isEditMode ? "Update Team" : "Create Team";
  const loadingText = isEditMode ? "Updating..." : "Creating...";

  return (
    <Modal open={open} onOpenChange={handleModalClose} title={modalTitle}>
      <form
        id="add-team-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {error && <ErrorAlert message={getErrorMessage(error.message)} />}

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
        {!isEditMode && (
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
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? loadingText : submitButtonText}
        </Button>
      </form>
    </Modal>
  );
}
