import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { Send } from "lucide-react";
interface MessageInputProps {
  onSend: (val:string) => void;
  onTyping:(isTyping:boolean)=>void
}

export default function MessageInput({  onSend,onTyping }: MessageInputProps) {
const [value,setValue ]= useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TYPING_TIMEOUT = 3000;
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {

    const text = e.target.value;
    setValue(text);

    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping(false); 
        typingTimeoutRef.current = null;
      }, TYPING_TIMEOUT);
    } else {
      setIsTyping(false);
      onTyping(false);
    }

    setValue(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setValue('')
    }
  };



  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
      
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
      }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    }
  };


  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);


  return (
    <div className="border-t p-4 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}