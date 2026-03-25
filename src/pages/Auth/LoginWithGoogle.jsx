import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { API_BASE_URL } from "@/Api/api";

const LoginWithGoogle = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/login/google`;
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full h-12 bg-white text-black hover:bg-neutral-200 border-neutral-800"
    >
      <FcGoogle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default LoginWithGoogle;