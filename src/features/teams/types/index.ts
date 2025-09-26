export interface Team {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  users: TeamMember[];
  invites: TeamInvite[];
}

export type MembersOption = {
  label: string;
  value: string;
  id?: string;
  role?: "admin" | "member";
};

export interface MemberInput {
  email: string;
  role?: "admin" | "member";
}

export interface TeamMember {
  id: string;
  role: "admin" | "member";
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  teamId: string;
  userId: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: "admin" | "member";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CANCELED";
  token: string;
  expiresAt: string;
  invitedBy?: string | null;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EligibleUser = {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
};

export type Page = { items: EligibleUser[]; nextCursor: string | null };
