import UserAvatar from "@/shared/components/UserAvatar";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useRef, useState } from "react";
import type { Attachment, Message } from "../types/messages";

function AttachmentCard({
  attachments,
  isOwn,
}: {
  attachments: Attachment[];
  isOwn: boolean;
}) {
  return (
    <div className="mt-2 flex gap-2 flex-wrap">
      {attachments.map(att => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-xl border p-2 w-40 transition
            ${isOwn ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}
          `}
        >
          <div className="w-full h-28 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
            {att.type.startsWith("image") ? (
              <img
                src={att.url}
                alt={att.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
          </div>

          <p className="text-xs font-medium truncate">{att.name}</p>
          <p className="text-[11px] text-gray-500">
            {(att.size / 1024).toFixed(1)} KB
          </p>
        </a>
      ))}
    </div>
  );
}


function MessageBubble({ message, currentUserId }: { message: Message, currentUserId?: string }) {
  const isOwn = message.senderId === currentUserId;

  return <div key={message.id} className={`flex gap-2 ${isOwn ? 'justify-start' : 'justify-end'}`}>
    <UserAvatar src={message?.sender?.profileImage} name={message?.sender?.name} />

    <div className={`max-w-2xl ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      <div className={`rounded-2xl px-4 py-3 bg-gray-200 text-gray-900`}>
        <p className="text-sm leading-relaxed">{message.content}</p>

        {!!message.attachments && !!message.attachments.length && <AttachmentCard attachments={message.attachments} isOwn={isOwn} />}
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>
    </div>
  </div>
}

function TypingIndicator({ name, avatar }: { name: string, avatar: string }) {
  return (
    <div className="flex gap-2 items-end justify-end mb-4">
      <UserAvatar src={avatar} name={name} />
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 font-medium">{name}</span>
          <span className="text-sm text-gray-600">typing..</span>
          <div className="flex gap-1 ml-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MessagesAreaProps {
  messages: Message[],
  showTyping: boolean,
  typingUsers: { id: string, name: string, avatar: string }[],
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function MessagesArea({
  messages,
  typingUsers,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MessagesAreaProps) {
  const { user } = useUserStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const prevMessagesLength = useRef(messages.length);


   useEffect(() => {
    if (shouldScroll && messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages, shouldScroll]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

    const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldScroll(isNearBottom);

    
    if (scrollTop === 0 && hasMore && !isLoadingMore && onLoadMore) {
      
      const previousScrollHeight = scrollHeight;
      onLoadMore();
      
      setTimeout(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-280px)]"
    ref={containerRef}
      onScroll={handleScroll}
  >
    {messages.map((msg) => (
      <MessageBubble message={msg} key={msg.id} currentUserId={user?.id} />
    ))}

    {typingUsers.map(u => (
      <TypingIndicator key={u.id} name={u.name} avatar={u.avatar} />
    ))}

    <div ref={messagesEndRef} />
  </div>
}