import type { AssigneeData } from "../schemas/tasks.schema";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskType {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  assignee: {
    username: string;
    profileImage?: string;
  };
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueAt: Date;
  priority: TaskPriority;
  assignee?: AssigneeData;
  columnId?: string;
};

export interface UserOption {
  label: string;
  value: string;
  id?: string;
  email?: string;
  username?: string;
  profileImage?: string;
  name?: string;
}
