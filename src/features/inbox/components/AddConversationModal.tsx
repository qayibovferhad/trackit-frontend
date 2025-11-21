import { searchUsers } from "@/features/teams/services/teams.service";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Search } from "lucide-react";
import UserAvatar from "@/shared/components/UserAvatar";
import { InputField } from "@/shared/components/InputField";

interface AddConversationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onStartConversation?: (payload: {
        userIds: string[];
        groupName?: string;
    }) => void;
}

export default function AddConversationModal({
    open,
    setOpen,
    onStartConversation
}: AddConversationModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('')
    const { data, isLoading } = useQuery({
        queryKey: ["all-users", searchQuery],
        queryFn: () => searchUsers(searchQuery, ["id", "name", "username", "profileImage"]),
        enabled: open,
        placeholderData: (prev) => prev,
    });

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleStartConversation = () => {
        if (selectedUsers.length > 0) {
            onStartConversation?.({
                userIds: selectedUsers,
                groupName: groupName || undefined
            });
            setSelectedUsers([]);
            setGroupName("");
            setSearchQuery("");
            setOpen(false);
        }
    };
    const handleClose = () => {
        setSelectedUsers([]);
        setSearchQuery("");
        setOpen(false);
    };


    return (
        <Modal title="Start Conversation" open={open} onOpenChange={handleClose}>
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                </div>

                {selectedUsers.length > 1 && <InputField htmlFor="groupName" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)} />}

                {selectedUsers.length > 0 && (
                    <div className="px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-700">
                            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                        </p>
                    </div>
                )}

                <div className="max-h-[400px] overflow-y-auto -mx-6 px-6">
                    {isLoading && !data ? (
                        <div className="py-12 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 mt-3">Loading users...</p>
                        </div>
                    ) : !data?.items || data.items.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            <p className="text-sm">No users found</p>
                            {searchQuery && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Try a different search term
                                </p>
                            )}
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {data.items.map((user) => {
                                const isSelected = user.id && selectedUsers.includes(user.id);

                                return (
                                    <li key={user.id}>
                                        <button
                                            onClick={() => user.id && toggleUserSelection(user.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 ${isSelected ? 'bg-purple-50 hover:bg-purple-100' : ''
                                                }`}
                                        >
                                            <div className="relative flex-shrink-0">

                                                <UserAvatar name={user.name} src={user.profileImage} />
                                                {user.presence === 'online' && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="font-medium text-gray-900 truncate text-sm">
                                                    {user.username || "Unknown User"}
                                                </div>
                                                {user.email && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </div>
                                                )}
                                            </div>

                                            {user.lastSeen && (
                                                <div className="text-xs text-gray-400 flex-shrink-0">
                                                    {user.lastSeen}
                                                </div>
                                            )}

                                            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-gray-300'
                                                }`}>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 -mx-6 px-6 -mb-6 pb-6">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStartConversation}
                        disabled={selectedUsers.length === 0}
                        className={`flex-1`}

                        variant={selectedUsers.length > 0
                            ? "violet"
                            : "outline"}
                    >
                        Start Chat ({selectedUsers.length})
                    </Button>
                </div>
            </div>
        </Modal>
    );
}