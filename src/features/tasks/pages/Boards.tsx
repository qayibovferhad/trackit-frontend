import BoardModal from "../components/board/BoardModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBoards } from "../services/boards.service";
import { useQuery } from "@tanstack/react-query";
import type { Board, BoardOption, Column, TaskType } from "../types";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { type SingleValue } from "react-select";
import BoardHeader from "../components/board/BoardHeader";
import BoardColumn from "../components/column/Column";
export const initialTasks: TaskType[] = [
  {
    id: "1",
    title: "Design login page",
    description: "Create a responsive login page with validation",
    date: "2025-09-25",
    priority: "High",
    assignee: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    title: "Setup database schema",
    description: "Define tables and relationships for user management",
    date: "2025-09-26",
    priority: "Medium",
    assignee: {
      name: "Bob Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    title: "Implement authentication",
    description: "Add JWT authentication for login and register",
    date: "2025-09-27",
    priority: "High",
    assignee: {
      name: "Charlie Brown",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: "4",
    title: "Setup CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    date: "2025-09-28",
    priority: "Low",
    assignee: {
      name: "Diana Prince",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  },
];
export default function Boards() {
  const [openModal, setOpenModal] = useState(false);
  const { id: teamId } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", "all"],
    queryFn: () => fetchBoards(teamId),
    staleTime: 10_000,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const options: BoardOption[] = (boards || []).map((b: Board) => ({
    value: b.id,
    label: b.name,
    board: b,
  }));

  useEffect(() => {
    if (!selectedBoard && options.length > 0) {
      setSelectedBoard(options[0].board);
      if (options[0].board.columns) {
        setColumns(options[0].board.columns as Column[]);
      } else {
        setColumns([]);
      }
    }
  }, [boards]);

  const handleSelectChange = (opt: SingleValue<BoardOption>) => {
    const board = opt ? opt.board : null;
    setSelectedBoard(board);
    if (board && board.columns) {
      setColumns(board.columns);
    } else {
      setColumns([]);
    }
  };

  return (
    <>
      <div className="px-6 pb-6">
        <BoardHeader
          onOpenChange={setOpenModal}
          options={options}
          boardsLoading={boardsLoading}
          selectedBoard={selectedBoard}
          onSelectChange={handleSelectChange}
        />
      </div>

      <div className="px-6 pb-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={() => {}}
          onDragOver={() => {}}
          onDragEnd={() => {}}
          modifiers={[restrictToWindowEdges]}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {[
                {
                  id: "col-1",
                  title: "To Do",
                  color: "gray",
                  order: 0,
                },
                {
                  id: "col-2",
                  title: "In Progress",
                  color: "blue",
                  order: 1,
                },
                {
                  id: "col-3",
                  title: "Review",
                  color: "yellow",
                  order: 2,
                },
                {
                  id: "col-4",
                  title: "Done",
                  color: "green",
                  order: 3,
                },
              ].map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  tasks={initialTasks}
                />
              ))}
            </SortableContext>

            {/* <AddColumnButton onAdd={handleAddColumn} /> */}
          </div>
        </DndContext>
      </div>

      {openModal && (
        <BoardModal
          open={openModal}
          onOpenChange={setOpenModal}
          defaultTeamId={teamId}
        />
      )}
    </>
  );
}
