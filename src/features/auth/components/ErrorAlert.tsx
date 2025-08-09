export function ErrorAlert({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md w-full">
      {message}
    </p>
  );
}
