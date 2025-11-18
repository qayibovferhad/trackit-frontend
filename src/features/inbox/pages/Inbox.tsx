import UserAvatar from "@/shared/components/UserAvatar";
import { Button } from "@/shared/ui/button";
import { MoreVertical, Plus, Settings } from "lucide-react";
import { useState } from "react";

export default function Inbox() {
    const [message, setMessage] = useState('');

    const conversations = [
        {
            id: 1,
            name: 'Robert Anderson',
            avatar: 'https://i.pravatar.cc/150?img=12',
            time: 'Just now',
            preview: "I'll do that task now, you can...",
            unread: 0
        },
        {
            id: 2,
            name: 'Henry Kane',
            avatar: 'https://i.pravatar.cc/150?img=33',
            time: '30mins ago',
            preview: 'Here is UX research Documen...',
            unread: 3
        },
        {
            id: 3,
            name: 'Juliana Wills',
            avatar: 'https://i.pravatar.cc/150?img=45',
            time: '3h ago',
            preview: 'If you complete Webdesign Ta...',
            unread: 0
        },
        {
            id: 4,
            name: 'Emma Olivia',
            avatar: 'https://i.pravatar.cc/150?img=47',
            time: 'a day ago',
            preview: 'Are you there?',
            unread: 0
        },
        {
            id: 5,
            name: 'Benjamin Jack',
            avatar: 'https://i.pravatar.cc/150?img=51',
            time: '2d ago',
            preview: 'Hi 👋',
            unread: 2
        }
    ];


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
            {/* Left Sidebar - Conversations */}
            <div className="w-120 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                            <p className="text-sm text-gray-500">Direct and team messages</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <Button className="w-full" variant="violet">
                        <Plus size={18} />Create Conversation
                    </Button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-100 transition-colors ${conv.id === 3 ? 'bg-gray-200' : ''
                                }`}
                        >
                            <div className="relative">  
                                <UserAvatar src={conv.avatar} size="lg"/>
                     
                                {conv.unread > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-medium">
                                        {conv.unread}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{conv.name}</span>
                                    <span className="text-xs text-gray-500">{conv.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{conv.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col bg-white ">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* <img
                            src="https://i.pravatar.cc/150?img=45"
                            alt="Juliana Wills"
                            className="w-10 h-10 rounded-full object-cover"
                        /> */}
                        <UserAvatar src={'https://i.pravatar.cc/150?img=45'}/>
                        <div>
                            <h3 className="font-semibold text-gray-900">Juliana Wills</h3>
                            <span className="text-xs text-gray-500">2hrs ago</span>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-280px)]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                            {!msg.isOwn && (
                                <UserAvatar src={msg.avatar} />
                            )}

                            <div className={`max-w-2xl ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`rounded-2xl px-4 py-3 ${msg.isOwn
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-900'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>

                                    {msg.hasAttachments && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-600 mb-3">
                                                If you complete <span className="text-purple-600 font-medium">Webdesign</span> Task,
                                                You can start another task with <span className="text-purple-600">@john</span>,
                                                Here is few documents, check this before starting your tasks
                                            </p>
                                            <div className="flex gap-3">
                                                {msg.attachments.map((att, idx) => (
                                                    <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200 w-32">
                                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-1">
                                                            {att.type === 'doc' ? (
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="text-xs font-medium text-gray-900 truncate">{att.name}</p>
                                                        <p className="text-xs text-gray-500">{att.size}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    <div className="flex items-start">
                        <UserAvatar src={'https://i.pravatar.cc/150?img=45'}/>
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">Typing</span>
                                <div className="flex gap-1 ml-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today Divider */}
                    {/* <div className="flex items-center justify-center py-2">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-xs text-gray-500 font-medium">TODAY</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div> */}
                </div>

                {/* Message Input */}
                <div className="px-6  border-t border-gray-200">
                    <div className="flex items-center gap-2 mt-4">
                        <UserAvatar src={`https://i.pravatar.cc/150?img=45`}/>
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
                            <input
                                type="text"
                                placeholder="Type Message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
                            />
                            <button className="text-gray-400 hover:text-gray-600">
                                <Settings size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}