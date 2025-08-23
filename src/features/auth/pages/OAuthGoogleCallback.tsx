import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthGoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1)); // #access=...
    const access = params.get("access");
    if (access) localStorage.setItem("access_token", access);

    window.history.replaceState({}, document.title, window.location.pathname);
    navigate("/settings", { replace: true });
  }, [navigate]);

  return <div>Logging in...</div>;
}
