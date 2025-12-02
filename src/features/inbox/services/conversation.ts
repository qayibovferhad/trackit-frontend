import { api } from "@/shared/lib/axios";
import type { Conversation } from "../types/conversation";

export const createConversation = async ({userIds,groupName}:{userIds:string[],groupName?:string}) => {  
  const response = await api.post('/conversations', { participantIds:userIds,name:groupName });
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/conversations');
  console.log(response,'datadatadatadatadata');
  
  return response.data;
};



export const getConversationById = async (conversationId:string): Promise<Conversation> => {
  const response = await api.get(`/conversations/${conversationId}`);
  return response.data;
};

export const markConversationAsRead = async (conversationId: string): Promise<{ success: boolean; unreadCount: number }> => {
  try {
    const { data } = await api.put(`/conversations/${conversationId}/read`);
    return data;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
};