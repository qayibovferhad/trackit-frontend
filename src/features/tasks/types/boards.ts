import type { TaskType } from "./tasks";

export interface Board {
  id: string;
  name: string;
  description: string;
  teamId: string;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: TaskType[];
  type?:ColumnType
}

export type ColumnType = "TODO" | "IN_PROGRESS" | "DONE" | "CUSTOM";


export type BoardOption = { value: string; label: string; board: Board };
