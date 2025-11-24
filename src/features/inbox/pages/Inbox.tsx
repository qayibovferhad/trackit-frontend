import { useEffect, useState } from "react";
import Conversations from "../components/Conversations";
import ChatHeader from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";
import { useNavigate, useParams } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { useSocket } from "@/shared/hooks/useSocket";

export default function Inbox() {
    const [message, setMessage] = useState('');
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const queryClient = new QueryClient()

    useEffect(() => {
        if (!conversationId) return;
        socket.emit("join", conversationId);

        console.log(socket.emit("join", conversationId),'socket.emit("join", conversationId);');
        

        
        socket.on("newMessage", (msg) => {
            console.log(msg,'msg');
            
            queryClient.setQueryData(['messages', conversationId], (old: any) => [
                ...(old ?? []),
                msg
            ]);
        });

        console.log(socket.on('newMessage',()=>{}),'123123123123123');
        


        return () => {
            socket.off("newMessage");
        };
    }, [conversationId]);

    

      const { data: messages=[] } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => getMessages(conversationId as string),
        enabled: !!conversationId
    });

    const handleSelect = (id:string) => {
        navigate(`/inbox/${id}`);
    };



    const sendMessage = () => {
        if (!message.trim() || !conversationId) return;


        console.log('32323232');
        
        socket.emit("sendMessage", {
            conversationId,
            content: message,
        });

        console.log(  socket.emit("sendMessage", {
            conversationId,
            content: message,
        }),11111);
        
        setMessage('');
    };

    
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