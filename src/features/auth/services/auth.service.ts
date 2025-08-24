import { api } from "../../../shared/lib/axios";
import type { ForgetPasswordFormData } from "../schemas/forgotPassword.schema";
import type { LoginFormData } from "../schemas/login.schema";
import type { RegisterFormData } from "../schemas/register.schema";
import type { ResetPasswordFormData } from "../schemas/resetPassword.schema";
import type { VerifyOtpFormData } from "../schemas/verifyOtp.schema";
import type {
  LoginResponse,
  User,
  VerifyOtpResponse,
} from "../types/auth.type";

export const loginRequest = async (
  data: LoginFormData
): Promise<LoginResponse> => {
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

export const getCurrentUserRequest = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  console.log("response", response);

  return response.data;
};
