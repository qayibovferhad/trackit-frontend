import PageHeader from "@/layouts/AppLayout/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import BoardModal from "../components/BoardModal";
import { useState } from "react";

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
  return (
    <>
      <div className="px-6 pb-10">
        <BoardsHeader onOpenChange={setOpenModal} />
      </div>

      {openModal && <BoardModal open={openModal} onOpenChange={setOpenModal} />}
    </>
  );
}
