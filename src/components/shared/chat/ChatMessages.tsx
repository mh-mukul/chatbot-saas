import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatConfig } from "./types";

interface ChatMessagesProps {
    messages: ChatMessage[];
    isLoading: boolean;
    config?: ChatConfig;
}

export function ChatMessages({ messages, isLoading, config }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const chatIcon = config?.chatIcon || <Bot className="h-5 w-5" />;
    const showTimestamp = config?.showTimestamp !== false;

    return (
        <ScrollArea className="flex-1 p-4">
            {messages.map((message, index) => (
                <div
                    key={message.id}
                    className={`flex items-end gap-2 ${index > 0 ? "mt-4" : ""} 
                        ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    {message.role !== "user" && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            {chatIcon}
                        </div>
                    )}

                    <div className={`flex flex-col max-w-[75%] min-w-0 ${message.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                            className={`rounded-2xl px-4 py-2 text-sm ${message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none"
                                }`}
                            style={
                                message.role === "user" && config?.primaryColor
                                    ? { backgroundColor: config.primaryColor }
                                    : {}
                            }
                        >
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        {showTimestamp && (
                            <span className={`text-[10px] text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : "text-left"} w-full`}>
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        )}
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
                        {chatIcon}
                    </div>
                    <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                        Thinking...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </ScrollArea>
    );
}
