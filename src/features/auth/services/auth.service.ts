import { api } from "../../../lib/axios";
import type { LoginFormData } from "../types/login.types";
import type { RegisterFormData } from "../types/register.types";

export const loginRequest = async (data: LoginFormData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerRequest = async (data: RegisterFormData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};
