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
