import { api } from "@/shared/lib/axios";
import type { NotificationItem } from "../types";

export const fetchUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/notifications/unread-count");
  return data;
};

export const fetchMyNotifications = async (): Promise<NotificationItem[]> => {
  const { data } = await api.get("/notifications");
  return data;
};
