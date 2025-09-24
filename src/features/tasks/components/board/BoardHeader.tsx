import PageHeader from "@/layouts/AppLayout/components/PageHeader";
import type { Board, BoardOption } from "../../types";
import Select, { type SingleValue } from "react-select";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

type BoardHeaderProps = {
  onOpenChange: (v: boolean) => void;
  boardsLoading?: boolean;
  options: BoardOption[];
  selectedBoard?: Board | null;
  onSelectChange: (opt: SingleValue<BoardOption>) => void;
};

export default function BoardHeader({
  onOpenChange,
  boardsLoading,
  options,
  selectedBoard,
  onSelectChange,
}: BoardHeaderProps) {
  return (
    <PageHeader
      title="Tasks Board"
      subtitle="Create and complete tasks using boards"
      actions={
        <>
          <Select
            isLoading={boardsLoading}
            options={options}
            value={
              selectedBoard
                ? {
                    value: selectedBoard.id,
                    label: selectedBoard.name,
                    board: selectedBoard,
                  }
                : null
            }
            onChange={onSelectChange}
            placeholder={boardsLoading ? "Loading boards..." : "Select a board"}
            isClearable={false}
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: "none",
                minHeight: "35px",
                height: "35px",
                width: "150px",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "#f3f3f3"
                  : state.isSelected
                  ? "#e5e5e5"
                  : "white",
                color: "#1a1a1a",
                cursor: "pointer",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50,
              }),
            }}
          />
          <Button
            type="button"
            onClick={() => onOpenChange(true)}
            className="inline-flex items-center gap-2 rounded-md bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </Button>
        </>
      }
    />
  );
}
