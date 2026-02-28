import { FormField } from "@/shared/components/FormField";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import { getTeamMembers } from "@/features/teams/services/teams.service";
import type { FieldError } from "react-hook-form";
import type { UserOption } from "../../types/tasks";

type Props = {
  value: UserOption[];
  onChange: (users: UserOption[]) => void;
  teamId?: string;
  isDisabled?: boolean;
  error?: FieldError | any;
};

async function fetchUserOptions(teamId: string, input: string): Promise<UserOption[]> {
  if (!input || input.length < 2) return [];
  try {
    const data = await getTeamMembers(teamId, input);
    return (data ?? []).map((member: any) => {
      const user = member.user;
      return {
        id: user.id,
        value: user.id,
        label: user.username || user.email,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      };
    });
  } catch {
    return [];
  }
}

export default function TaskAssigneeField({ value, onChange, teamId, isDisabled, error }: Props) {
  return (
    <FormField label="Assign To" htmlFor="assignee" error={error}>
      <GenericAsyncSelect<UserOption>
        value={value}
        onChange={onChange}
        placeholder="Search by email or username..."
        loadOptions={(input) => fetchUserOptions(teamId || "", input)}
        allowCreateOption={false}
        isMulti={false}
        isDisabled={isDisabled}
        noOptionsMessage={() => "No users found"}
      />
    </FormField>
  );
}
