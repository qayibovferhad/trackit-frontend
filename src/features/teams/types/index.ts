export interface Team {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
}

export type MembersOption = { label: string; value: string; id?: string };
