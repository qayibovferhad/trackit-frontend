import { InputField } from "@/shared/components/InputField";
import { Modal } from "@/shared/ui/modal";
import { boardSchema, type BoardFormData } from "../schemas/boards.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { fetchMyAdminTeams } from "@/features/teams/services/teams.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";
import type { Team } from "@/features/teams/types";
import { addBoard } from "../services/boards.service";

type BoardModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
};

export default function BoardModal({ open, onOpenChange }: BoardModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(boardSchema);

  const { data: teams } = useQuery({
    queryKey: ["my-admin-teams"],
    queryFn: fetchMyAdminTeams,
    staleTime: 10_000,
    gcTime: 30 * 60_000,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addBoard,
  });
  async function onSubmit(data: BoardFormData) {
    await mutateAsync(data);
    onOpenChange(false);
  }
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Board">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="add-team-form"
        className="space-y-4"
      >
        <InputField
          label="Board Name"
          htmlFor="name"
          register={register}
          error={errors.name}
        />

        <FormField label="Team" error={errors.teamId}>
          <select
            {...register("teamId")}
            className="w-full border rounded-md p-2 text-sm text-gray-600"
          >
            <option value="">Select a team</option>
            {teams?.map((team: Team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </FormField>
        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </Modal>
  );
}
