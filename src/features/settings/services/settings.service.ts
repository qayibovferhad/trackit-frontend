import { api } from "@/shared/lib/axios";
import type { ChangePasswordFormData } from "../schemas/changePassword.schema";

export const changePasswordRequest = async (data: ChangePasswordFormData) => {
  const response = await api.post("/settings/password", data);
  return response.data;
};
