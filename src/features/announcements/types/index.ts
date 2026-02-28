export type Announcement = {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    profileImage: string | null;
  };
  teamId: string | null;
  team: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementPayload = {
  title: string;
  description: string;
  teamId?: string;
  isPublic?: boolean;
};

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>;
