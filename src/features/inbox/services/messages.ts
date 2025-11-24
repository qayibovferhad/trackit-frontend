import { api } from "@/shared/lib/axios";
import type { Message } from "../types/messages";

export const getMessages = async (conversationId:string):Promise<Message[]> => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};