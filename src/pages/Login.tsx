import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Static credentials
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your AI Agent platform.",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Use 'admin' and 'password'.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="absolute inset-0 opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-gradient-card border-border/50 shadow-elegant backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text">
              AI Agent Platform
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to manage your intelligent agents
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 transition-smooth"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-muted/50 border-border/50 transition-smooth"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full transition-spring font-medium"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo credentials: <span className="font-mono">admin / password</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;