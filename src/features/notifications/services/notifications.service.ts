import { api } from "@/shared/lib/axios";

export const fetchUnreadCount = async (): Promise<number> => {
  const { data } = await api.get("/notifications/unread-count");
  return data;
};
