import { Button } from "@/shared/ui/button";
import GoogleIcon from "../../../assets/icons/google-icon.png";

export default function GoogleAuthButton({ text }: { text: string }) {
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5500/api/auth/google";
  };
  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full bg-white text-black cursor-pointer flex items-center justify-center border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
    >
      <img src={GoogleIcon} alt="Google" className="w-4 h-4 mr-2" />
      {text}
    </Button>
  );
}
