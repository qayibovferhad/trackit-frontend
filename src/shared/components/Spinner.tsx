export default function Spinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background opacity-0"
      style={{ animation: "delayedFadeIn 0.2s 0.2s forwards" }}
    >
      <div className="w-8 h-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
