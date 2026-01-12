import type { User } from "@/features/auth/types/auth.type";


export interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
}


export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  senderId:string;
  conversationId:string;
  tempId:string;
  hasAttachments:boolean;
  timestamp:string
  attachments?: Attachment[];
}

export interface MessageResponse {
  messages:Message[],
  nextCursor:string | null,
  hasMore:boolean
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  tempId: string;
  files?: File[];
}
