import { create } from "zustand";
import type { UserStoreState } from "./types";
import { devtools, persist } from "zustand/middleware";
import { getCurrentUserRequest } from "@/features/auth/services/auth.service";
import { setAccessToken } from "@/shared/lib/authStorage";

export const useUserStore = create<UserStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        error: null,
        isLoading: false,
        fetchUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const data = await getCurrentUserRequest();
            console.log(data,'datadata');
            
            set({ user: data, isLoading: false });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Failed to fetch user";
            set({
              error: errorMessage,
              isLoading: false,
            });
          }
        },
        setUser: (user) => {
          set({ user, error: null });
        },
        updateUser: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser });
          }
        },
        logout: () => {
          set({
            user: null,
            error: null,
            isLoading: false,
          });
          setAccessToken(null);
          localStorage.removeItem("user-storage");
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        },
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          user: state.user,
        }),
      }
    ),
    {
      name: "user-store",
    }
  )
);
