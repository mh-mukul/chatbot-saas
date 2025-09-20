import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { embedChatRequest, embedChat as embedChatApi, chatResponse } from "@/services/chat_apis";
import { Send, Bot, User, RefreshCcw, Smile } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getOrCreateSessionId, clearSessionId } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    EmojiPicker,
    EmojiPickerSearch,
    EmojiPickerContent,
    EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

// CSS-in-JS style block for theme-specific styles that matches index.css
const themeStyles = `
  body:not(.dark-theme) {
    /* Light mode - from index.css :root */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    
    --radius: 0.5rem;
    
    color-scheme: light;
  }
  
  body.dark-theme {
    /* Dark mode - from index.css .dark */
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 0 0% 98%;
    
    color-scheme: dark;
  }
  
  /* Utility classes that use the HSL variables */
  .bg-background {
    background-color: hsl(var(--background));
  }
  
  .text-foreground {
    color: hsl(var(--foreground));
  }
  
  .bg-primary {
    background-color: hsl(var(--primary));
  }
  
  .text-primary-foreground {
    color: hsl(var(--primary-foreground));
  }
  
  .bg-muted {
    background-color: hsl(var(--muted));
  }
  
  .text-muted-foreground {
    color: hsl(var(--muted-foreground));
  }
  
  .border {
    border-color: hsl(var(--border));
  }
  
  /* Add additional utility classes */
  .hover\\:bg-muted:hover {
    background-color: hsl(var(--muted));
  }
  
  .focus\\:ring-1:focus {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.3);
  }
  
  .focus\\:outline-none:focus {
    outline: none;
  }
  
  .focus\\:ring-primary:focus {
    box-shadow: 0 0 0 2px hsl(var(--primary) / 0.3);
  }
`;

export default function EmbedChat() {
    const [searchParams] = useSearchParams();
    const agent_id = searchParams.get("agent_id") || "";
    const theme = searchParams.get("theme") || "light";

    // Set theme class and inject theme styles
    useEffect(() => {
        // Create style element to inject theme CSS
        const styleEl = document.createElement('style');
        styleEl.textContent = themeStyles;
        document.head.appendChild(styleEl);

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
            // Also add a class to the body for additional theme targeting
            document.body.classList.add("dark-theme");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
            document.body.classList.remove("dark-theme");
        }

        // Clean up
        return () => {
            document.head.removeChild(styleEl);
        };
    }, [theme]);

    const [messages, setMessages] = useState<{
        id: string;
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState<string>(getOrCreateSessionId());

    async function sendMessage() {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: input.trim(),
            timestamp: new Date()
        };

        // Add user message immediately
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        const currentInput = input;
        setInput("");

        try {
            // Call the embedChat API
            const response = await embedChatApi({
                agent_id,
                session_id: sessionId,
                query: currentInput,
            });

            // Add bot response
            setMessages((prev) => [...prev, {
                id: response.id,
                role: response.role,
                content: response.content,
                timestamp: new Date(response.timestamp)
            }]);
        } catch (err) {
            console.error("Error invoking embed chat:", err);
            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, I encountered an error while processing your request.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background border text-foreground">
            {/* Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
                <h2 className="font-medium">Chat Assistant</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={
                        () => {
                            clearSessionId();
                            window.location.reload();
                        }
                    }
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex items-end gap-2 ${index > 0 ? "mt-4" : ""} ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        {message.role !== "user" && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                            </div>
                        )}

                        <div className="flex flex-col max-w-[75%]">
                            <div
                                className={`rounded-2xl px-4 py-2 text-sm ${message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none self-end"
                                    : "bg-muted text-foreground rounded-bl-none self-start"
                                    }`}
                            >
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>

                        {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                                <User className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-2 justify-start mt-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t">
                <div className="relative flex items-center">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder={isLoading ? "Waiting for response..." : "Ask anything..."}
                        disabled={isLoading}
                        className="pr-20 rounded-full"
                    />
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    disabled={isLoading}
                                >
                                    <Smile className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit p-0">
                                <EmojiPicker
                                    className="h-[342px]"
                                    onEmojiSelect={({ emoji }) => {
                                        setInput(prev => prev + emoji);
                                    }}
                                >
                                    <EmojiPickerSearch className="h-8 focus:outline-none focus:ring-0" />
                                    <EmojiPickerContent />
                                    <EmojiPickerFooter />
                                </EmojiPicker>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                        variant="ghost"
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
