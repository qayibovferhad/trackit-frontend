export interface TaskType {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  assigneeUser: string;
}

export interface UserOption {
  label: string;
  value: string;
  id?: string;
  email?: string;
  username?: string;
  avatar?: string;
  name?: string;
}
