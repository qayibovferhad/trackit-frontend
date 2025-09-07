import {
  Ellipsis,
  NotepadTextIcon,
  Pen,
  PlusIcon,
  Trash,
  Trash2,
} from "lucide-react";
import type { Team } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <div
      key={team.id}
      className="rounded-xl border bg-card text-card-foreground transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {team.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <div className="text-md font-base leading-tight">{team.name}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4.5 w-4.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">
                  {team.users.length ?? 0} Members
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="flex items-center justify-center rounded-md hover:bg-muted"
              >
                <Ellipsis className="opacity-70" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-46">
              <DropdownMenuRow
                iconCircle={false}
                icon={<PlusIcon className="!size-5" />}
                label="Invite User"
                onClick={() => {}}
              />
              <DropdownMenuRow
                iconCircle={false}
                icon={<Pen className="!size-5" />}
                label="Edit Team"
                onClick={() => {}}
              />
              <DropdownMenuRow
                iconCircle={false}
                icon={<Trash2 className="!size-5" />}
                label="Delete Team"
                onClick={() => {}}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
