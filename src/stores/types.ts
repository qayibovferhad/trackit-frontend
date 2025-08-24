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
