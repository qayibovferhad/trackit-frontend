export type SearchTask = {
  id: string;
  title: string;
  dueAt: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  completedAt: string | null;
  assignee: { id: string; name: string | null; profileImage: string | null } | null;
  column: { title: string } | null;
};

export type SearchAnnouncement = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: { id: string; name: string | null; profileImage: string | null };
};

export type SearchTeam = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: { users: number };
};

export type SearchResults = {
  tasks: SearchTask[];
  announcements: SearchAnnouncement[];
  teams: SearchTeam[];
  total: number;
  query: string;
};
