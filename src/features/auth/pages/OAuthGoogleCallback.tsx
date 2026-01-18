import { PATHS } from "@/shared/constants/routes";
import { setAccessToken } from "@/shared/lib/authStorage";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
  const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      setAccessToken(token);
      window.location.href = PATHS.SETTINGS
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate]);

  return <div>Logging in...</div>;
}
