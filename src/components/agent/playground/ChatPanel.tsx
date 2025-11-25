import React from "react";
import { Bot, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatUI, ChatMessage } from "@/components/shared/chat";

interface ChatPanelProps {
    agentName: string;
    messages: any[];
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
}

const ChatPanel = ({ agentName, messages, isLoading, sendMessage }: ChatPanelProps) => {
    // Convert messages to ChatMessage format
    const chatMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
    }));

    return (
        <div className="flex-1 flex items-center justify-center dotted-background">
            <div className="h-[90vh] max-w-md w-full mx-auto">
                <ChatUI
                    messages={chatMessages}
                    isLoading={isLoading}
                    config={{
                        displayName: agentName,
                        placeholder: "Ask anything...",
                        chatIcon: <Bot className="h-4 w-4" />,
                        showHeader: true,
                        showTimestamp: true,
                    }}
                    features={{
                        headerActions: (
                            <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        ),
                        showEmojiPicker: true,
                    }}
                    callbacks={{
                        onSendMessage: sendMessage,
                    }}
                />
            </div>
        </div>
    );
};

export default ChatPanel;
