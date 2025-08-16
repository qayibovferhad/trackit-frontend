export interface NotificationSettingsType {
  generalEmails: boolean;
  userJoined: boolean;
  kitPurchase: boolean;
  kitLaunched: boolean;
  weeklyReport: boolean;
  newMessage: boolean;
}

export type AccountStatus = "active" | "deactivated";

export type UpdateStatusRequest = {
  status: AccountStatus;
  reason?: string;
};

export interface PersonalDetailsData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  profileImage?: string;
}
