export type VerifyOtpResponse = {
  resetToken: string;
};

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  name: string;
  description: string;
  lastSeen: string,
  presence: 'online' | 'offline' | 'away';
  isOnline:boolean;
  lastSeenAt:Date
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
