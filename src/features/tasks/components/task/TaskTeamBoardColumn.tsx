import Select from "react-select";
import { FormField } from "@/shared/components/FormField";
import GenericAsyncSelect from "@/shared/components/GenericAsyncSelect";
import { fetchSharedTeams } from "@/features/teams/services/teams.service";
import { getTeamPermissions } from "@/features/teams/hooks/useTeamPermissions";
import { useUserStore } from "@/stores/userStore";
import type { Team } from "@/features/teams/types";
import type { Column } from "../../types/boards";
import type { TeamOption } from "../../types/tasks";

type BoardOption = { value: string; label: string; columns: Column[] };

type Props = {
  defaultUserId: string;
  selectedTeamOption: TeamOption | null;
  boards: any[] | null;
  boardsLoading: boolean;
  columnsOptions: Column[] | null;
  onTeamChange: (team: TeamOption[]) => void;
  onBoardChange: (board: BoardOption | null) => void;
  onColumnChange: (column: { value: string; label: string } | null) => void;
};

const selectStyles = {
  control: (base: any) => ({ ...base, boxShadow: "none", minHeight: "35px", height: "35px" }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f3f3" : state.isSelected ? "#e5e5e5" : "white",
    color: "#1a1a1a",
    cursor: "pointer",
  }),
  menu: (base: any) => ({ ...base, zIndex: 50 }),
};

export default function TaskTeamBoardColumn({
  defaultUserId,
  selectedTeamOption,
  boards,
  boardsLoading,
  columnsOptions,
  onTeamChange,
  onBoardChange,
  onColumnChange,
}: Props) {
  const user = useUserStore((s) => s.user);

  async function fetchTeamOptions(input: string): Promise<TeamOption[]> {
    if (!input || input.length < 2) return [];
    try {
      const data = await fetchSharedTeams(input, defaultUserId);
      console.log((data ?? [])
        .filter((team: Team) => getTeamPermissions(user, team).canCreateTask),'data');
      
      return (data ?? [])
        .filter((team: Team) => getTeamPermissions(user, team).canCreateTask)
        .map((team: Team) => ({
          id: team.id,
          value: team.id,
          label: team.name,
        }));
    } catch {
      return [];
    }
  }

  return (
    <>
      <FormField label="Team" htmlFor="team">
        <GenericAsyncSelect<TeamOption>
          value={selectedTeamOption ? [selectedTeamOption] : []}
          onChange={onTeamChange}
          placeholder="Search by name..."
          loadOptions={fetchTeamOptions}
          allowCreateOption={false}
          isMulti={false}
          noOptionsMessage={() => "No team found"}
        />
      </FormField>

      {selectedTeamOption && (
        <FormField label="Board" htmlFor="board">
          <Select
            isLoading={boardsLoading}
            options={boards?.map((b) => ({ value: b.id, label: b.name, columns: b.columns }))}
            placeholder={boardsLoading ? "Loading boards..." : "Select a board"}
            isClearable={false}
            onChange={onBoardChange}
            styles={selectStyles}
          />
        </FormField>
      )}

      {columnsOptions && (
        <FormField label="Column" htmlFor="column">
          <Select
            options={columnsOptions.map((c) => ({ value: c.id, label: c.title }))}
            placeholder="Select a column"
            isClearable={false}
            onChange={onColumnChange}
            styles={selectStyles}
          />
        </FormField>
      )}
    </>
  );
}
