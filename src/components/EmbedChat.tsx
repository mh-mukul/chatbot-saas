import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { embedChat as embedChatApi, chatResponse } from "@/services/chat_apis";
import { getChatWidgetSettings, chatWidgetSettings } from "@/services/embed_chat_apis";
import { Bot } from "lucide-react";
import { getOrCreateSessionId } from "@/lib/utils";
import { ChatHeader } from "./embed-chat/ChatHeader";
import { MessageList } from "./embed-chat/MessageList";
import { ChatInput } from "./embed-chat/ChatInput";
import { themeStyles as embedChatThemeStyles } from "./embed-chat/theme-styles";

export default function EmbedChat() {
    const [searchParams] = useSearchParams();
    const agent_id = searchParams.get("agent_id") || "";
    const theme = searchParams.get("theme") || "light";
    const [widgetSettings, setWidgetSettings] = useState<chatWidgetSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch widget settings
    useEffect(() => {
        const fetchSettings = async () => {
            if (!agent_id) {
                setError("Agent ID is required");
                setLoading(false);
                return;
            }

            try {
                const settings = await getChatWidgetSettings(Number(agent_id));

                // Check if the agent is private, show error if it is
                if (settings.is_private) {
                    setError("Configuration not found");
                    setLoading(false);
                    return;
                }

                setWidgetSettings(settings);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching widget settings:", err);
                setError("Failed to load chat settings");
                setLoading(false);
            }
        };

        fetchSettings();
    }, [agent_id]);

    // Set theme class and inject theme styles
    useEffect(() => {
        // Create style element to inject theme CSS
        const styleEl = document.createElement('style');
        styleEl.textContent = embedChatThemeStyles;
        document.head.appendChild(styleEl);

        // Use widget settings theme if available, otherwise use URL param
        const effectiveTheme = widgetSettings?.chat_theme || theme;

        // Get the main container - we'll apply theme directly to it for isolation
        const chatContainer = document.getElementById('embed-chat-container');

        if (chatContainer) {
            // Remove any existing theme classes
            chatContainer.classList.remove('light', 'dark', 'dark-theme');

            // Apply the theme directly to the container
            if (effectiveTheme === "dark") {
                chatContainer.classList.add('dark', 'dark-theme');
                chatContainer.setAttribute('data-theme', 'dark');
            } else {
                chatContainer.classList.add('light');
                chatContainer.setAttribute('data-theme', 'light');
            }

            // Apply primary color if available
            if (widgetSettings?.primary_color) {
                chatContainer.style.setProperty('--primary', widgetSettings.primary_color);
            }
        }

        // Clean up
        return () => {
            document.head.removeChild(styleEl);
        };
    }, [theme, widgetSettings]);

    // Chat state
    const [messages, setMessages] = useState<chatResponse[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState<string>(getOrCreateSessionId());
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    // Initialize chat messages with welcome message from widget settings when loaded
    useEffect(() => {
        if (widgetSettings) {
            // Set initial messages from widget settings
            const initialMessage = widgetSettings.initial_messages || "Hello! How can I help you today?";
            setMessages([{
                id: '1',
                role: 'assistant',
                content: initialMessage,
                timestamp: new Date(),
            }]);

            // Parse and set suggested messages if available
            if (widgetSettings.suggested_messages) {
                try {
                    // Parse suggested messages with newlines
                    const suggestedArray = widgetSettings.suggested_messages
                        .split('\n')
                        .map(msg => msg.trim())
                        .filter(Boolean);
                    setSuggestedMessages(suggestedArray);
                } catch (error) {
                    console.error("Error parsing suggested messages:", error);
                }
            }
        }
    }, [widgetSettings]);

    // Chat icon component
    const ChatIcon = () => {
        if (widgetSettings?.chat_icon) {
            return (
                <div className="flex items-center justify-center overflow-hidden">
                    <img
                        src={widgetSettings.chat_icon}
                        alt="Chat icon"
                        className="object-contain w-5 h-5"
                        style={{
                            aspectRatio: "1/1"
                        }}
                    />
                </div>
            );
        }
        return <Bot className="h-5 w-5" />;
    };

    // Send message function
    async function sendMessage(messageOverride?: string) {
        const messageText = messageOverride || input.trim();
        if ((!messageText || isLoading)) return;

        const userMessage: chatResponse = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: messageText,
            timestamp: new Date()
        };

        // Add user message immediately
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        const currentInput = messageText;

        // Only clear input if we're not using an override (suggested message)
        if (!messageOverride) {
            setInput("");
        }

        try {
            // Call the embedChat API with agent_id from widget settings or URL params
            const effectiveAgentId = widgetSettings?.agent_id.toString() || agent_id;

            if (!effectiveAgentId) {
                throw new Error("No agent ID available");
            }

            const response = await embedChatApi({
                agent_id: effectiveAgentId,
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

    // Handle suggested message click
    const handleSuggestedMessageClick = (message: string) => {
        // Send the suggested message directly without updating the input field
        sendMessage(message);
    };

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

    return (
        <div
            id="embed-chat-container"
            data-theme={widgetSettings?.chat_theme || theme}
            className={`flex flex-col h-screen w-full bg-background border rounded-lg shadow-lg text-foreground ${widgetSettings?.chat_theme || theme}`}
            style={customStyles}>
            {/* Header Component */}
            <ChatHeader
                title={widgetSettings?.display_name || "Chat Assistant"}
                chatIcon={<ChatIcon />}
            />

            {/* Messages Component */}
            <MessageList
                messages={messages}
                isLoading={isLoading}
                chatIcon={<ChatIcon />}
            />

            {/* Suggested Messages Section */}
            {suggestedMessages.length > 0 && !isLoading && !messages.some(msg => msg.role === 'user') && (
                <div className="px-4 py-2">
                    <div className="flex flex-wrap gap-2 justify-end">
                        {suggestedMessages.map((message, index) => (
                            <div
                                key={index}
                                className="border border-muted hover:bg-muted/10 rounded-lg px-3 py-1.5 text-sm cursor-pointer text-foreground transition-colors whitespace-nowrap"
                                onClick={() => handleSuggestedMessageClick(message)}
                            >
                                {message}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Component */}
            <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={() => sendMessage()}
                isLoading={isLoading}
                placeholder={widgetSettings?.message_placeholder || "Ask anything..."}
                primaryColor={widgetSettings?.primary_color}
            />
        </div>
    );
}
