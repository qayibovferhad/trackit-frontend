import { Button } from "@/shared/ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import type { TaskType } from "../../types/tasks";
import TaskItem from "./TaskItem";


const EmptySubtasks = () => (
    <div className="text-center py-8 text-gray-500">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No subtasks yet</p>
        <p className="text-xs text-gray-400 mt-1">
            Add your first subtask to get started
        </p>
    </div>
);

export default function SubtaskList({ subtasks, onEdit, onDelete,setOpenModal }: {
    subtasks: TaskType[],
    setOpenModal:()=>void,
    onEdit: (task: TaskType) => void;
    onDelete: (task: TaskType) => void;
}) {
    return <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    Subtasks
                </h2>
                <p className="text-sm text-gray-500">
                    You can add subtasks and assign to others
                </p>
            </div>
            <Button
                variant="violet"
                onClick={setOpenModal}
            >
                <Plus className="w-4 h-4" />
                Add Subtask
            </Button>
        </div>

        {subtasks.length === 0 ? (
            <EmptySubtasks />
        ) : (
            <div className="space-y-3">
                {subtasks.map((subtask) => (
                    <TaskItem
                        key={subtask.id}
                        task={subtask}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isSubtask
                    />
                ))}
            </div>
        )}
    </div>
}