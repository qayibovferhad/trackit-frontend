import { create } from 'zustand';
import type { ChatState } from './types';

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  typingUsers: {},
  setTypingUser: (conversationId, userData) => 
    set((state) => {
      const newTypingUsers = { ...state.typingUsers };
      if (userData) {
        newTypingUsers[conversationId] = userData;
      } else {
        delete newTypingUsers[conversationId];
      }
      return { typingUsers: newTypingUsers };
    }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
}));