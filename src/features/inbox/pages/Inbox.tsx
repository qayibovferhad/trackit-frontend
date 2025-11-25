import { useEffect, useState } from "react";
import Conversations from "../components/Conversations";
import ChatHeader from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { useSocket } from "@/shared/hooks/useSocket";

export default function Inbox() {
 const [message, setMessage] = useState('');
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const {socket,isConnected} = useSocket();
  
  const queryClient = useQueryClient(); // useQueryClient istifadə edin, QueryClient yox

 useEffect(() => {
    if (!conversationId || !socket || !isConnected) return; 

    socket.emit("join", conversationId);

    const handleNewMessage = (msg) => {
      console.log(msg, 'msg');
      
      queryClient.setQueryData(['messages', conversationId], (old) => [
        ...(old ?? []),
        msg
      ]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, socket, queryClient]);


  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId
  });

  const handleSelect = (id) => {
    navigate(`/inbox/${id}`);
  };

  const sendMessage = () => {
    if (!message.trim() || !conversationId) return;

    socket.emit("sendMessage", {
      conversationId,
      content: message,
    });

    setMessage('');
  };


  console.log(messages,'messages');
  
    
    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50">
            <Conversations onSelect={handleSelect}/>

            <div className="flex-1 flex flex-col bg-white ">
                <ChatHeader name='Farhad Qayibov' lastSeen='2hr ago' />

                <MessagesArea messages={messages} showTyping />
                <MessageInput
                    value={message}
                    onChange={(value) => setMessage(value)}
                    onSend={sendMessage} 
                />

            </div>
        </div>
    )
}