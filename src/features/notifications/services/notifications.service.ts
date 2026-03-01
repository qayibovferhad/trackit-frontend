import { api } from "@/shared/lib/axios";
import type { NotificationItem } from "../types";

export const fetchUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/notifications/unread-count");
  return data;
};

export const fetchMyNotifications = async (
  page: number,
  limit = 10,
): Promise<{ data: NotificationItem[]; total: number; totalPages: number }> => {
  const { data } = await api.get("/notifications", { params: { page, limit } });
  return data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch("/notifications/mark-all-read");
};
