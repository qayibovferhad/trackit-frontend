import { api } from "@/shared/lib/axios";
import type {
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "../types";

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const { data } = await api.get("/announcements");
  return data;
};

export const fetchAnnouncementById = async (
  id: string
): Promise<Announcement> => {
  const { data } = await api.get(`/announcements/${id}`);
  return data;
};

export const createAnnouncement = async (
  payload: CreateAnnouncementPayload
): Promise<Announcement> => {
  const { data } = await api.post("/announcements", payload);
  return data;
};

export const updateAnnouncement = async (
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<Announcement> => {
  const { data } = await api.patch(`/announcements/${id}`, payload);
  return data;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await api.delete(`/announcements/${id}`);
};
