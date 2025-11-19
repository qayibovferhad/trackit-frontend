import { useState } from "react";
import Conversations from "../components/Conversations";
import ChatHeader from "../components/ChatHeader";
import MessagesArea from "../components/MessagesArea";
import MessageInput from "../components/MessageInput";

export default function Inbox() {
    const [message, setMessage] = useState('');



    const messages = [
        {
            id: 1,
            sender: 'Juliana Wills',
            avatar: 'JW',
            time: '2hrs ago',
            content: "Hi 👋 I'll do that task now, you can start working on another task!",
            hasAttachments: true,
            attachments: [
                { name: 'Webdesign.doc', size: '3.4MB', type: 'doc' },
                { name: 'Branding.PDF', size: '12.5MB', type: 'pdf' }
            ],
            timestamp: '25/10/2022 • 10:00AM'
        },
        {
            id: 2,
            sender: 'You',
            time: '2hrs ago',
            content: "Hello @Juliana, I'll completed the task you send ✅",
            isOwn: true,
            timestamp: 'Today • 2hrs ago'
        }
    ];

    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50">
            <Conversations />

            <div className="flex-1 flex flex-col bg-white ">
                <ChatHeader name='Farhad Qayibov' lastSeen='2hr ago' />

                <MessagesArea messages={messages} showTyping />
                <MessageInput
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

            </div>
        </div>
    )
}