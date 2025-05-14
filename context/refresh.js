import { create } from "zustand";

export const useRefreshStore = create((set) => ({
  refresh: false,
  triggerRefresh: () => set((state) => ({ refresh: !state.refresh })), // Toggle refresh state
}));
