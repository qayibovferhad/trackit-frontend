import { InputField } from "@/shared/components/InputField";
import { Modal } from "@/shared/ui/modal";
import { boardSchema } from "../schemas/boards.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { fetchTeams } from "@/features/teams/services/teams.service";
import { useQuery } from "@tanstack/react-query";
import { FormField } from "@/shared/components/FormField";
import { Button } from "@/shared/ui/button";

type BoardModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
};

export default function BoardModal({ open, onOpenChange }: BoardModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(boardSchema);

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 10_000,
    gcTime: 30 * 60_000,
  });

  console.log("teams", teams);

  function onSubmit() {}
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create Board">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="add-team-form"
        className="space-y-4"
      >
        <InputField label="Board Name" htmlFor="name" register={register} />

        <FormField label="Team">
          <select
            {...register("teamId")}
            className="w-full border rounded-md p-2 text-sm text-gray-600"
          >
            <option value="">Select a team</option>
            {teams?.map((team: any) => (
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
