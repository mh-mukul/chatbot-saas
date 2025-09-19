import React, { useState } from "react";
import { Send, Bot, User, RefreshCcw, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
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

interface ChatPanelProps {
    agentName: string;
    messages: any[];
    isLoading: boolean;
    sendMessage: (message: string) => void;
}

const ChatPanel = ({ agentName, messages, isLoading, sendMessage }: ChatPanelProps) => {
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
        <div className="flex-1 flex items-center justify-center dotted-background">
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
                                Thinking...
                            </div>
                        </div>
                    )}
                </ScrollArea>

                {/* Footer Input */}
                <div className="p-3 border-t">
                    <div className="relative flex items-center">
                        <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={isLoading ? "Waiting for response..." : "Ask anything..."}
                            className="pr-20"
                            disabled={isLoading}
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
                                            setCurrentMessage(prev => prev + emoji);
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
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim() || isLoading}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                            variant="ghost"
                            size="icon"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
