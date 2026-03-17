import type { TaskType } from "@/features/tasks/types/tasks";
import type { ColumnType } from "@/features/tasks/types/boards";

export interface TimelineTask extends TaskType {
  startDate: Date;        
  status: ColumnType;
  groupId: string;
  groupName: string;
}
