import { api } from "@/shared/lib/axios";
import type { ChangePasswordFormData } from "../schemas/changePassword.schema";
import type { NotificationSettingsType, UpdateStatusRequest } from "../types";

export const changePasswordRequest = async (data: ChangePasswordFormData) => {
  const response = await api.post("/me/password", data);
  return response.data;
};

export const changeStatusRequest = async (payload: UpdateStatusRequest) => {
  const { data } = await api.patch("/me/status", payload);
  return data;
};

export const deleteMyAccount = async (): Promise<void> => {
  await api.delete("/me");
};

export async function getNotificationSettings(): Promise<NotificationSettingsType> {
  const response = await api.get("/me/notifications");
  return response.data;
}

export async function updateNotificationSettings(
  settings: NotificationSettingsType
): Promise<NotificationSettingsType> {
  const response = await api.patch("/me/notifications", settings);
  return response.data;
}
