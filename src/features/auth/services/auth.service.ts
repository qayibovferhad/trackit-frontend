import { api } from "../../../lib/axios";
import type { ForgetPasswordFormData } from "../types/forgotPassword.types";
import type { LoginFormData } from "../types/login.types";
import type { RegisterFormData } from "../types/register.types";
import type { ResetPasswordFormData } from "../types/resetPassword.types";
import type {
  VerifyOtpFormData,
  VerifyOtpResponse,
} from "../types/verifyOtp.types";

export const loginRequest = async (data: LoginFormData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerRequest = async (data: RegisterFormData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPasswordRequest = async (data: ForgetPasswordFormData) => {
  const response = await api.post("/auth/password/forgot", data);
  return response.data;
};

export const verifyOtpRequest = async (
  data: VerifyOtpFormData
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/auth/password/verify-otp", data);
  return response.data;
};

export const resetPasswordRequest = async (data: ResetPasswordFormData) => {
  const response = await api.post("/auth/password/reset", data);
  return response.data;
};
