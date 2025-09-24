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
}

export type BoardOption = { value: string; label: string; board: Board };

export interface TaskType {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  assignee: {
    name: string;
    avatar: string;
  };
}
