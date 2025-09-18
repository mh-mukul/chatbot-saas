import { useState } from "react";
import { Send, Bot, User, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

const ChatUI = ({ agentName, messages, isLoading, sendMessage }) => {
    const [currentMessage, setCurrentMessage] = useState("");

    const handleSendMessage = async () => {
        if (!currentMessage.trim()) return;
        const msg = currentMessage;
        setCurrentMessage("");
        await sendMessage(msg);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[90vh] max-w-md w-full mx-auto border rounded-2xl bg-background shadow-lg">
            {/* Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
                <h2 className="font-medium">{agentName}</h2>
                <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex items-end gap-2 ${index > 0 ? "mt-4" : ""
                            } ${message.role === "user"
                                ? "justify-end"
                                : "justify-start"
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
                    <div className="flex gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                            Typing...
                        </div>
                    </div>
                )}
            </ScrollArea>

            {/* Footer Input */}
            <div className="p-3 border-t flex gap-2 items-center">
                <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={isLoading ? "Waiting for response..." : "Ask anything..."}
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="rounded"
                    variant="ghost"
                    size="icon"
                >
                    <Send className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};

export default ChatUI;
