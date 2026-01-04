import type { User } from "@/features/auth/types/auth.type";

export interface UserStoreState {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  clearError: () => void;
}


export interface ChatState {
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
}


export interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastSeenAt: Date;
}

export interface UserStatusStore {
  userStatuses: Map<string, UserStatus>;
  setUserStatus: (status: UserStatus) => void;
  getUserStatus: (userId: string) => UserStatus | undefined;
  setMultipleStatuses: (statuses: UserStatus[]) => void;
  clearStatuses: () => void;
}