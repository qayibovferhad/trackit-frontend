import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask } from "../services/tasks.service";
import type { Column, Board } from "../types/boards";
import type { CreateTaskPayload } from "../types/tasks";

export function useTaskMutations(
 options?: {
    setColumns?: React.Dispatch<React.SetStateAction<Column[]>>;
    setSelectedBoard?: React.Dispatch<React.SetStateAction<Board | null>>;
  }
) {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask, variables) => {
      if(options?.setColumns){
       options.setColumns((prev) =>
        prev.map((col) =>
          col.id === variables.columnId
            ? { ...col, tasks: [...(col.tasks || []), newTask] }
            : col
        )
      );
      }
    
      if(options?.setSelectedBoard){
         options.setSelectedBoard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns?.map((col) =>
            col.id === variables.columnId
              ? { ...col, tasks: [...(col.tasks || []), newTask] }
              : col
          ),
        };
      });
      }

      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<CreateTaskPayload>;
    }) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  return { createTaskMutation, updateTaskMutation };
}
