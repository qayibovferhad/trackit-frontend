import UserAvatar from "@/shared/components/UserAvatar";
import { useUserStore } from "@/stores/userStore";

function AttachmentCard({ attachments }) {
    return <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-3">
            If you complete <span className="text-purple-600 font-medium">Webdesign</span> Task,
            You can start another task with <span className="text-purple-600">@john</span>,
            Here is few documents, check this before starting your tasks
        </p>
        <div className="flex gap-3">
            {attachments.map((att, idx) => (
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
}

function MessageBubble({ message,currentUserId }) {
    const isOwn = message.senderId === currentUserId;

    return <div key={message.id} className={`flex gap-2 ${isOwn ? 'justify-start' : 'justify-end'}`}>
            <UserAvatar src={message?.sender?.profileImage} name={message?.sender?.name} />

        <div className={`max-w-2xl ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
            <div className={`rounded-2xl px-4 py-3 ${isOwn
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-900'
                }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.hasAttachments && <AttachmentCard attachments={message.attachments}/>}
            </div>
            <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>
        </div>
    </div>
}

export default function MessagesArea({ messages }: { messages: any,showTyping:boolean }) {
    const {user} = useUserStore()
    return <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-280px)]">
        {messages.map((msg) => (
            <MessageBubble message={msg} key={msg.id} currentUserId={user?.id}/>
        ))}

        <div className="flex gap-2 items-start">
            <UserAvatar src={'https://i.pravatar.cc/150?img=45'} />
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
    </div>
}