import { api } from "@/shared/lib/axios";
import type { Attachment, MessageResponse } from "../types/messages";

export const getMessages = async (
  conversationId: string, 
  cursor?: string,
  limit = 20
):Promise<MessageResponse> => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (cursor) {
    params.append('cursor', cursor);
  }

  const response = await api.get(
    `/messages/${conversationId}?${params.toString()}`
  );

  
    
    return {
      messages: response.data.data,
      nextCursor: response.data.nextCursor,
      hasMore: response.data.hasMore
    };
  
};

export const uploadMessageAttachments = async (
  files: File[]
): Promise<
  Attachment[]
> => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("files", file);
  });

  const { data } = await api.post("/messages/attachments", formData);
  return data;
};