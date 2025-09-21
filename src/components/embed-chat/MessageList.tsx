import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { chatResponse } from "@/services/chat_apis";

interface MessageListProps {
    messages: chatResponse[];
    isLoading: boolean;
    chatIcon: React.ReactNode;
}

export function MessageList({
    messages,
    isLoading,
    chatIcon,
}: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
                <div
                    key={message.id}
                    className={`flex items-end gap-2 ${index > 0 ? "mt-4" : ""} 
                        ${message.role === "user" ? "justify-end user-message" : "justify-start"}`}
                >
                    {message.role !== "user" && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            {chatIcon}
                        </div>
                    )}

                    <div className={`flex flex-col max-w-[75%] min-w-0 ${message.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                            className={`rounded-2xl px-4 py-2 text-sm ${message.role === "user"
                                ? "bg-primary text-primary-foreground user-bubble rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                                }`}
                            style={message.role === "user" ? { backgroundColor: "var(--widget-primary-color)" } : {}}
                        >
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <span className={`text-[10px] text-muted-foreground mt-1 ${message.role === "user" ? "text-right" : "text-left"} w-full`}>
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
                        {chatIcon}
                    </div>
                    <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                        Thinking...
                    </div>
                </div>
            )}
        </div>
    );
}
