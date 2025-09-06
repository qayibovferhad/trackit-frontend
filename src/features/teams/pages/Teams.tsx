import { Button } from "@/shared/ui/button";
import TeamCard from "../components/TeamCard";
import AddTeamModal from "../components/AddTeamModal";
import { useState } from "react";

export default function Teams() {
  const [open, setOpen] = useState(false);
  const teams = [
    { id: "1", name: "UI/UX Design Team", membersCount: 36 },
    { id: "2", name: "Development Team", membersCount: 36 },
    { id: "3", name: "Product Research Team", membersCount: 36 },
    { id: "4", name: "HR Team", membersCount: 36 },
    { id: "5", name: "Marketing Team", membersCount: 36 },
    { id: "6", name: "Motion Design Team", membersCount: 36 },
    { id: "7", name: "Senior Developers Team", membersCount: 36 },
    { id: "8", name: "Managers Team", membersCount: 36 },
  ];
  return (
    <>
      <div className="px-6 pb-10">
        <div className="mb-3 flex items-center gap-3 justify-between">
          <div>
            <h1 className="text-lg font-semibold">My Teams</h1>
            <p className="text-sm text-muted-foreground">
              32 Total teams are added
            </p>
          </div>
          <Button variant="soft" onClick={() => setOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 mr-2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Team
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
      <AddTeamModal open={open} onOpenChange={setOpen} />
    </>
  );
}
