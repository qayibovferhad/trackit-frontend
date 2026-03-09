import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";
import type { Column as ColumnType } from "../../types/boards";
import TaskCard from "../task/TaskCard";
import { colorOptions } from "@/shared/constants/colors";
import type { TaskType } from "../../types/tasks";
import { Button } from "@/shared/ui/button";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuRow,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type ColorOption = (typeof colorOptions)[number];

// Frozen during drag — none of these props change on pointer move
const ColumnHeader = memo(function ColumnHeader({
  column,
  taskCount,
  colorOption,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: ColumnType;
  taskCount: number;
  colorOption: ColorOption;
  onAddTask?: (id: string) => void;
  onEditColumn?: (column: ColumnType) => void;
  onDeleteColumn?: (columnId: string) => void;
}) {
  const hasMenu = onEditColumn || onDeleteColumn;

  return (
    <div className={`px-4 py-3 border-b-2 ${colorOption.border} rounded-t-xl ${colorOption.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm font-bold ${colorOption.text} whitespace-normal break-words max-w-[170px]`}
          >
            {column.title}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              colorOption.name === "gray"
                ? "bg-gray-100 text-gray-600"
                : `bg-${colorOption.name}-50 text-${colorOption.name}-600 border border-${colorOption.name}-200`
            }`}
          >
            {taskCount}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onAddTask && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-7 w-7 rounded-lg hover:${
                colorOption.name === "gray" ? "bg-gray-100" : `bg-${colorOption.name}-50`
              } transition-colors`}
              aria-label="Add task"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className={`w-4 h-4 ${colorOption.text}`} />
            </Button>
          )}
          {hasMenu && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-lg hover:${
                    colorOption.name === "gray" ? "bg-gray-100" : `bg-${colorOption.name}-50`
                  } transition-colors`}
                  aria-label="Column menu"
                >
                  <MoreHorizontal className={`w-4 h-4 ${colorOption.text}`} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="center" className="w-16">
                {onEditColumn && (
                  <DropdownMenuRow
                    iconCircle
                    icon={<Edit />}
                    label="Edit"
                    onClick={() => onEditColumn(column)}
                    iconSize={4}
                  />
                )}
                {onDeleteColumn && (
                  <DropdownMenuRow
                    iconCircle
                    icon={<Trash2 />}
                    label="Delete"
                    onClick={() => onDeleteColumn(column.id)}
                    iconSize={4}
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
});

// Frozen during drag — only re-renders when tasks array or colorOption changes
const ColumnTaskList = memo(function ColumnTaskList({
  tasks,
  taskIds,
  colorOption,
}: {
  tasks: TaskType[];
  taskIds: string[];
  colorOption: ColorOption;
}) {
  if (tasks.length > 0) {
    return (
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div
        className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
          colorOption.name === "gray" ? "bg-gray-50" : `bg-${colorOption.name}-50`
        }`}
      >
        <Plus
          className={`w-6 h-6 ${
            colorOption.name === "gray"
              ? "text-gray-300"
              : colorOption.text.replace("700", "300")
          }`}
        />
      </div>
      <p
        className={`text-sm font-medium ${
          colorOption.name === "gray" ? "text-gray-400" : colorOption.text.replace("700", "400")
        }`}
      >
        No tasks yet
      </p>
      <p className="text-xs text-gray-300 mt-1">Click + to add your first task</p>
    </div>
  );
});

function Column({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: ColumnType;
  tasks: TaskType[];
  onAddTask?: (id: string) => void;
  onEditColumn?: (column: ColumnType) => void;
  onDeleteColumn?: (columnId: string) => void;
}) {
  const droppableData = useMemo(() => ({ type: "Column" as const, column }), [column.id]);
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: droppableData,
  });

  const colorOption = useMemo(
    () => colorOptions.find((c) => c.name === column.color) ?? colorOptions[0],
    [column.color]
  );

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div className="flex-1 min-w-0 h-full">
      <div
        className={`flex flex-col h-full rounded-xl border-2 ${colorOption.border} shadow-sm ${
          isOver ? "bg-gray-50 border-blue-300" : "bg-white"
        } transition-colors duration-200`}
      >
        <ColumnHeader
          column={column}
          taskCount={tasks.length}
          colorOption={colorOption}
          onAddTask={onAddTask}
          onEditColumn={onEditColumn}
          onDeleteColumn={onDeleteColumn}
        />

        <div
          ref={setDroppableRef}
          className={`p-2 flex-1 space-y-3 min-h-[200px] overflow-y-auto overflow-x-hidden ${
            isOver ? "bg-gray-100" : ""
          }`}
        >
          <ColumnTaskList tasks={tasks} taskIds={taskIds} colorOption={colorOption} />
        </div>
      </div>
    </div>
  );
}

export default memo(Column);
