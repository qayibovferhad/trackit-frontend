import { create } from 'zustand';
import type { ChatState } from './types';

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
}));