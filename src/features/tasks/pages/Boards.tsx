import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

function BoardsHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xl font-medium text-slate-900">Tasks Board</h4>
          <p className="mt-1 text-sm text-slate-500">
            Create and complete tasks using boards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Boards() {
  return (
    <div className="p-6">
      <BoardsHeader />

      <div></div>
    </div>
  );
}
