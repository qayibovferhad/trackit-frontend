import UserAvatar from "@/shared/components/UserAvatar";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  userName?: string;
  userImage?: string;
}

export const CommentForm = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  userName,
  userImage,
}: CommentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <UserAvatar name={userName} src={userImage} size="md" />
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          placeholder="Write your comment..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
