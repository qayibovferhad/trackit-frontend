import UserAvatar from "@/shared/components/UserAvatar";
import { MoreVertical, Settings } from "lucide-react";

export default function MessageInput({ value, onChange, onSend }) {
    return (
                <div className="px-6  border-t border-gray-200">
                    <div className="flex items-center gap-2 mt-4">
                        <UserAvatar src={`https://i.pravatar.cc/150?img=45`}/>
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
                            <input
                                type="text"
                                placeholder="Type Message..."
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
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
    );
}