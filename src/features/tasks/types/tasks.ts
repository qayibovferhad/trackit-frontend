import type { AssigneeData } from "../schemas/tasks.schema";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskType {
  id: string;
  title: string;
  description: string;
  dueAt: Date;
  tags?: string[];
  priority: string;
  teamId: string;
  assignee: {
    id: string;
    email: string;
    username: string;
    profileImage?: string;
    name?: string;
  };
  subtasks: TaskType[];
  columnId?: string;
  parentTaskId?: string;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueAt: Date;
  priority?: TaskPriority;
  assignee?: AssigneeData;
  tags?: string[];
  columnId?: string;
  parentTaskId?: string;
  teamId?: string;
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
