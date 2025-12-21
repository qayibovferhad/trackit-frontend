import { api } from "@/shared/lib/axios";
import type { Attachment, Message } from "../types/messages";

export const getMessages = async (conversationId:string):Promise<Message[]> => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
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