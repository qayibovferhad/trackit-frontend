import { useState, Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import type { Team } from "@/features/teams/types";

type Props = {
  teams?: Array<{ id: string; name: string }>;
  className?: string;
};

export function TeamsDropdown({ teams = [], className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "group flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition mb-5",
          "text-gray-700 hover:bg-gray-200",
          open ? "bg-gray-300 text-accent-foreground" : ""
        )}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="truncate">Boards</span>
        </div>
        <ChevronDown
          className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="ml-2 mt-1 w-full">
          <nav className="flex flex-col">
            {teams.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No teams
              </div>
            ) : (
              teams.map((t) => {
                const to = `/boards?teamId=${t.id}`;

                return (
                  <NavLink
                    key={t.id}
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition mb-1",
                        isActive
                          ? "bg-accent text-accent-foreground bg-gray-300"
                          : "text-gray-700 hover:bg-gray-200"
                      )
                    }
                  >
                    <span className="truncate">{t.name}</span>
                  </NavLink>
                );
              })
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
