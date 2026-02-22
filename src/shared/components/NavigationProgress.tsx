import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function NavigationProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-violet-100 overflow-hidden">
      <div className="h-full bg-violet-600 animate-[navigationProgress_1.4s_ease-in-out_infinite]" />
    </div>
  );
}
