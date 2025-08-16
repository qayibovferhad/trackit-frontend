import { api } from "@/shared/lib/axios";
import type { ChangePasswordFormData } from "../schemas/changePassword.schema";
import type { NotificationSettingsType, UpdateStatusRequest } from "../types";
import type {
  EmailUpdateFormData,
  PhoneUpdateFormData,
  ProfileDetailsFormData,
} from "../schemas/personalDetails.schema";

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

export const getPersonalDetails = async () => {
  const response = await api.get("/me/profile");
  return response.data;
};

export const updatePersonalDetails = async (data: ProfileDetailsFormData) => {
  const response = await api.patch("/me/profile", data);
  return response.data;
};

export const uploadProfileImage = async (formData: FormData) => {
  const response = await api.post("/me/profile/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.imageUrl;
};

export const updateEmail = async (data: EmailUpdateFormData) => {
  const response = await api.patch("/me/email", data);
  return response.data;
};

export const updatePhone = async (data: PhoneUpdateFormData) => {
  const response = await api.patch("/me/phone", data);
  return response.data;
};
