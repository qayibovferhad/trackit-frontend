import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { Send, Settings, MoreHorizontal, Trash2, Image, File, X } from "lucide-react";
import UserAvatar from "@/shared/components/UserAvatar";
import { useUserStore } from "@/stores/userStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRow, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

interface MessageInputProps {
  onSend: (val: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSend, onTyping }: MessageInputProps) {
  const [value, setValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore()
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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white border-t border-gray-200">
      {selectedFiles.length > 0 && (
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-gray-50 rounded-lg p-2 pr-8 flex items-center gap-2 max-w-xs"
              >
                {file.type.startsWith('image/') ? (
                  <Image className="w-4 h-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <UserAvatar src={user?.profileImage} name={user?.name} size="lg" />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type Message..."
              className="flex-1 w-full resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto" rows={1}
              style={{ minHeight: '50px' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  aria-label="Comment options"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top">
                <DropdownMenuRow
                  icon={<File />}
                  label="Upload File"
                  iconSize={4}
                  onClick={() => fileInputRef.current?.click()}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={handleSend}
              disabled={!value.trim() && selectedFiles.length === 0}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>

          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}