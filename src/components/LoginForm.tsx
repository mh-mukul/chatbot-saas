import { cn } from "@/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, BotMessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loginApi, LoginResponse } from "@/services/api/auth_apis"
import { Checkbox } from "@/components/ui/checkbox"
import { CycleTheme } from "./ui/cycle-theme"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response: LoginResponse = await loginApi({ phone, password });
            toast({
                title: "Login Successful",
                description: `Welcome back, ${response.user.name}!`,
                variant: "default",
            });
            // Store token and user data
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            localStorage.setItem("user", JSON.stringify(response.user));
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            toast({
                title: "Login Failed",
                description: "Invalid phone or password. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">Sign in to continue</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="text"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full transition-spring font-medium">
                                Sign In
                            </Button>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="keep-logged-in" />
                                    <Label htmlFor="keep-logged-in" className="dark:text-neutral-200">Keep me logged in</Label>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Signup is disabled. Please contact administrator for account access.
                                </p>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden md:block">
                        <div className="absolute top-1 right-1 z-20">
                            <CycleTheme />
                        </div>
                        <img
                            src="/login-banner.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
                        />
                        <div className="absolute inset-0 py-8 px-6">
                            <div className="flex items-center space-x-2">
                                <BotMessageSquare className="h-6 w-6" />
                                <p className="text-xl font-bold bg-clip-text text-white">AgentIQ</p>
                            </div>
                            <p className="text-white/80 font-bold mt-8 text-3xl max-w-xs">
                                Seamless chat. Smarter support.
                            </p>
                            <p className="text-white/80 mt-10 text-l max-w-sm">
                                A powerful platform to manage, monitor, and optimize your AI agents. Gain real-time insights, track performance, and stay in control of every conversation.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
