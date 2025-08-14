export interface NotifState {
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
