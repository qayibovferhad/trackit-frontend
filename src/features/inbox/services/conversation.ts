import { api } from "@/shared/lib/axios";
import type { Conversation } from "../types/conversation";

export const createConversation = async ({userIds,groupName}:{userIds:string[],groupName?:string}) => {
  console.log(groupName,'groupName');
  
  const response = await api.post('/conversations', { participantIds:userIds,name:groupName });
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/conversations');
  return response.data;
};