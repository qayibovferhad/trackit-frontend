import { PATHS } from "@/shared/constants/routes";
import { setAccessToken } from "@/shared/lib/authStorage";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (!token) {
      navigate('/login?error=no_token');
      return;
    }

    setAccessToken(token);

    fetchUser().then(() => {
      const user = useUserStore.getState().user;
       navigate(PATHS.HOME)
    });
  }, []);

  return <div>Logging in...</div>;
}
