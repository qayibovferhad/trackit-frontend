import { useMemo } from "react";
import type { Conversation } from "../types/conversation";
import type { User } from "@/features/auth/types/auth.type";

export function useChatHeader(conversation: Conversation | undefined, user: User | null) {
  return useMemo(() => {
    if (!conversation || !user) return null;

    const { type, participants, name } = conversation;

    if (type === 'DIRECT') {
      const otherUser = participants.find((p) => p.user.id !== user.id)?.user;
      if (!otherUser) return null;

      return {
        username: otherUser.username,
        name: otherUser.name,
        isOnline: otherUser.isOnline,
        avatar: otherUser.profileImage,
        lastSeenAt: otherUser.lastSeenAt,
        isGroup: false,
        participants: [{ user: otherUser }]
      };
    }

    if (type === 'GROUP') {
      const participantCount = participants.length;

      return {
        name: name || `Group (${participantCount})`,
        avatar: null,
        lastSeenAt: null,
        isGroup: true,
        isOnline: false,
        participants: participants.filter(pr => pr.userId !== user.id) || [],
      };
    }

    return null;
  }, [conversation, user]);
}