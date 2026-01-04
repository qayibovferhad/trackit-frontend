import { create } from "zustand";
import type { UserStatusStore } from "./types";

export const useUserStatusStore = create<UserStatusStore>((set, get) => ({
  userStatuses: new Map(),
  
  setUserStatus: (status) => set((state) => {
    const newStatuses = new Map(state.userStatuses);
    newStatuses.set(status.userId, {
      ...status,
      lastSeenAt: new Date(status.lastSeenAt) 
    });
    return { userStatuses: newStatuses };
  }),
  
  getUserStatus: (userId) => get().userStatuses.get(userId),
  
  setMultipleStatuses: (statuses) => set((state) => {
    const newStatuses = new Map(state.userStatuses);
    statuses.forEach(status => {
      newStatuses.set(status.userId, {
        ...status,
        lastSeenAt: new Date(status.lastSeenAt)
      });
    });
    return { userStatuses: newStatuses };
  }),

  clearStatuses: () => set({ userStatuses: new Map() }),
}));