export type VerifyOtpResponse = {
  resetToken: string;
};

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
