import PageHeader from "@/layouts/AppLayout/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import BoardModal from "../components/BoardModal";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyAdminTeams } from "@/features/teams/services/teams.service";
import { fetchBoards } from "../services/boards.service";
import type { Team } from "@/features/teams/types";
import type { Board } from "../types";

function BoardCard({ board }: { board: Board }) {
  return (
    <div className="p-3 border rounded-md shadow-sm bg-white">
      <h4 className="font-medium text-sm">{board.name}</h4>
      <p className="text-xs text-gray-500">{board.description}</p>
    </div>
  );
}

function BoardsHeader({
  onOpenChange,
}: {
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <PageHeader
      title="Tasks Board"
      subtitle="Create and complete tasks using boards"
      actions={
        <Button
          type="button"
          onClick={() => onOpenChange(true)}
          className="inline-flex items-center gap-2 rounded-md bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <Plus className="w-4 h-4" />
          Create Board
        </Button>
      }
    />
  );
}

export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | "all">("all");

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["my-teams"],
    queryFn: fetchMyAdminTeams,
    staleTime: 30_000,
  });

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", "all"],
    queryFn: () => fetchBoards(),
    staleTime: 10_000,
  });

  const handleTeamFilter = (id: string | "all") => {
    setSelectedTeamId(id);
  };

  return (
    <>
      <div className="px-6 pb-6">
        <BoardsHeader onOpenChange={setOpenModal} />
      </div>

      <div className="px-6 pb-10"></div>

      {openModal && (
        <BoardModal
          open={openModal}
          onOpenChange={setOpenModal}
          // defaultTeamId={selectedTeamId === "all" ? undefined : selectedTeamId}
        />
      )}
    </>
  );
}
