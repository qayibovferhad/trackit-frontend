import type { Team } from "@/features/teams/types";
import { NavItemLink } from "@/shared/components/NavItemLink";
import { cn } from "@/shared/lib/utils";
import type { NavItem } from "@/shared/types/nav.types";
import { ChevronDown, ChevronRight } from "lucide-react";

type BoardsItemProps = {
  boardsItem: NavItem;
  isExpanded: boolean;
  onToggle: () => void;
  teams?: Team[];
  isLoading?: boolean;
};

export default function BoardsItem({
  boardsItem,
  isExpanded,
  onToggle,
  teams = [],
  isLoading = false,
}: BoardsItemProps) {
  return (
    <div className="space-y-1">
      <button
        className={cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-2 w-full justify-between",
          "text-gray-700 hover:bg-gray-200"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {boardsItem.icon && <boardsItem.icon className="size-5" />}
          <span className="truncate text-gray-700">{boardsItem.label}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </button>

      {isExpanded && (
        <div className="ml-8 space-y-1">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              Loading teams...
            </div>
          ) : teams.length > 0 ? (
            teams.map((team) => (
              <NavItemLink
                key={team.id}
                to={`/boards/${team.id}`}
                label={team.name}
                exact={false}
                className="mb-0 mt-0"
              />
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No teams available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
