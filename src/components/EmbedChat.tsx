import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot, Ellipsis, MessageCirclePlusIcon, History, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { removeSessionId } from '@/lib/utils';
import { ChatUI, ChatMessage } from "@/components/shared/chat";
import { SessionList } from "./embed-chat/SessionList";
import { useEmbedChatSettings, useEmbedChatTheme, useEmbedChatSession } from "@/hooks/use-embed-chat";

export default function EmbedChat() {
    const [searchParams] = useSearchParams();
    const agent_uid = searchParams.get("agent_uid") || "";
    const theme = searchParams.get("theme") || "light";

    // Use custom hooks
    const { widgetSettings, loading, error } = useEmbedChatSettings(agent_uid);
    useEmbedChatTheme(theme, widgetSettings);
    const {
        messages,
        isLoading,
        userId,
        suggestedMessages,
        loadingSession,
        handleSessionSelect,
        sendMessage
    } = useEmbedChatSession(agent_uid, widgetSettings);

    const [showingHistory, setShowingHistory] = useState(false);

    // If still loading or error occurred, show appropriate state
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading chat widget...</div>
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-xl font-semibold text-destructive mb-2">{error}</div>
                {error === "Configuration not found" && (
                    <p className="text-sm text-muted-foreground">This chat widget is not accessible.</p>
                )}
            </div>
        );
    }

    // Generate style object for theme customization from widget settings
    const customStyles = widgetSettings ? {
        "--widget-primary-color": widgetSettings.primary_color || undefined,
    } as React.CSSProperties : {};

    // Toggle history view
    const handleToggleHistory = () => {
        setShowingHistory(prev => !prev);
    };

    // Convert messages to ChatMessage format
    const chatMessages: ChatMessage[] = messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
    }));

    // Chat icon component
    const ChatIcon = () => {
        if (widgetSettings?.chat_icon) {
            return (
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                    <img
                        src={widgetSettings.chat_icon}
                        alt="Chat icon"
                        className="object-contain w-8 h-8"
                        style={{
                            aspectRatio: "1/1"
                        }}
                    />
                </div>
            );
        }
        return <Bot className="h-5 w-5" />;
    };

    // Custom header for embed chat with history toggle
    const EmbedChatHeader = () => (
        <div className="px-4 py-4 border-b flex justify-between items-center relative">
            <div className="flex items-center gap-2">
                {showingHistory ? (
                    <Button variant="ghost" size="icon" onClick={handleToggleHistory} className="mr-1">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                ) : null}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground scale-110">
                    <ChatIcon />
                </div>
                <h2 className="font-medium">{showingHistory ? "Chat History" : widgetSettings?.display_name || "Chat Assistant"}</h2>
            </div>
            {!showingHistory && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                removeSessionId();
                                window.location.reload();
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <MessageCirclePlusIcon className="h-4 w-4" />
                            <span>New Chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleToggleHistory}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <History className="h-4 w-4" />
                            <span>History</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );

    return (
        <div
            id="embed-chat-container"
            data-theme={widgetSettings?.chat_theme || theme}
            className={`flex flex-col h-screen w-full bg-background border rounded-lg shadow-lg text-foreground ${widgetSettings?.chat_theme || theme}`}
            style={customStyles}>
            {showingHistory ? (
                /* Session History View */
                <>
                    <EmbedChatHeader />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <SessionList
                            agentId={agent_uid}
                            userId={userId}
                            onSelectSession={(sessionId) => {
                                handleSessionSelect(sessionId);
                                setShowingHistory(false);
                            }}
                        />
                    </div>
                </>
            ) : (
                /* Chat View */
                <ChatUI
                    messages={chatMessages}
                    isLoading={isLoading || loadingSession}
                    config={{
                        displayName: widgetSettings?.display_name || "Chat Assistant",
                        placeholder: widgetSettings?.message_placeholder || "Ask anything...",
                        theme: widgetSettings?.chat_theme as 'light' | 'dark',
                        primaryColor: widgetSettings?.primary_color,
                        chatIcon: <ChatIcon />,
                        showHeader: true,
                        showTimestamp: true,
                        containerClassName: "h-full rounded-none border-0",
                    }}
                    features={{
                        suggestedQuestions: suggestedMessages,
                        headerActions: (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Ellipsis className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            removeSessionId();
                                            window.location.reload();
                                        }}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <MessageCirclePlusIcon className="h-4 w-4" />
                                        <span>New Chat</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleToggleHistory}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <History className="h-4 w-4" />
                                        <span>History</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ),
                        showEmojiPicker: true,
                    }}
                    callbacks={{
                        onSendMessage: sendMessage,
                    }}
                />
            )}
        </div>
    );
}

