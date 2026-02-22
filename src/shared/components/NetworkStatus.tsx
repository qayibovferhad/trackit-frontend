import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      setTimeout(() => setVisible(false), 2000);
    };
    const onOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all duration-300
        ${isOnline ? "bg-green-500 text-white" : "bg-gray-900 text-white"}`}
    >
      <WifiOff size={16} />
      {isOnline ? "Back online" : "No internet connection"}
    </div>
  );
}
