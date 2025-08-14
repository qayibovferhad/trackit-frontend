import { api } from "@/shared/lib/axios";
import type { ChangePasswordFormData } from "../schemas/changePassword.schema";
import type { UpdateStatusRequest } from "../types";

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
