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

  const grouped = useMemo(() => {
    const map = new Map<string, Board[]>();
    (boards || []).forEach((b) => {
      const key = b.teamId ?? "no-team";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return map;
  }, [boards]);

  const handleTeamFilter = (id: string | "all") => {
    setSelectedTeamId(id);
  };

  const isLoading = teamsLoading || boardsLoading;

  return (
    <>
      <div className="px-6 pb-6">
        <BoardsHeader onOpenChange={setOpenModal} />
        <div className="mt-4 flex gap-3 items-center flex-wrap">
          <button
            onClick={() => handleTeamFilter("all")}
            className={`px-3 py-1 rounded ${
              selectedTeamId === "all"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>

          {(teams || []).map((t: Team) => (
            <button
              key={t.id}
              onClick={() => handleTeamFilter(t.id)}
              className={`px-3 py-1 rounded ${
                selectedTeamId === t.id
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {selectedTeamId !== "all" ? (
              <section>
                <h3 className="text-lg font-semibold mb-3">
                  {teams?.find((t) => t.id === selectedTeamId)?.name ?? "Team"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(grouped.get(selectedTeamId) || []).length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No boards for this team. Create one!
                    </div>
                  ) : (
                    (grouped.get(selectedTeamId) || []).map((b) => (
                      <BoardCard key={b.id} board={b} />
                    ))
                  )}
                </div>
              </section>
            ) : (
              <>
                {Array.from(grouped.entries()).length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No boards yet. Create your first board!
                  </div>
                ) : (
                  Array.from(grouped.entries()).map(([teamId, list]) => {
                    const team = teams?.find((t) => t.id === teamId);
                    const title = team ? team.name : "No Team";
                    return (
                      <section key={teamId} className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">{title}</h3>
                        {list.length === 0 ? (
                          <div className="text-sm text-gray-500">
                            No boards for this team.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {list.map((b) => (
                              <BoardCard key={b.id} board={b} />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })
                )}
              </>
            )}
          </>
        )}
      </div>

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
