import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BotMessageSquare } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("access_token");
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center dotted-background p-4">
      <div className="absolute inset-0 opacity-5"></div>

      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl relative z-10">
        {/* Show icon and title only on mobile */}
        <div className="text-center mb-6 md:hidden">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow bg-background/50 backdrop-blur-sm">
            <BotMessageSquare className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mt-4 bg-clip-text">
            AgentIQ
          </h1>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;