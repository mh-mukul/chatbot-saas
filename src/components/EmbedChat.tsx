import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    embedChat as embedChatApi,
    getUserSessionMessages,
    getChatWidgetSettings,
    chatWidgetSettings,
    Message,
} from "@/services/api/embed_chat_apis";
import { Bot } from "lucide-react";
import { getSessionId, setSessionId, getOrCreateUserId, removeSessionId } from '@/lib/utils';
import { ChatHeader } from "./embed-chat/ChatHeader";
import { MessageList } from "./embed-chat/MessageList";
import { ChatInput } from "./embed-chat/ChatInput";
import { SessionList } from "./embed-chat/SessionList";
import { themeStyles as embedChatThemeStyles } from "./embed-chat/theme-styles";

export default function EmbedChat() {
    const [searchParams] = useSearchParams();
    const agent_uid = searchParams.get("agent_uid") || "";
    const theme = searchParams.get("theme") || "light";
    const [widgetSettings, setWidgetSettings] = useState<chatWidgetSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch widget settings
    useEffect(() => {
        const fetchSettings = async () => {
            if (!agent_uid) {
                setError("Agent ID is required");
                setLoading(false);
                return;
            }

            try {
                const settings = await getChatWidgetSettings(agent_uid);

                // Check if the agent is private, show error if it is
                if (!settings.is_public) {
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
    }, [agent_uid]);

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionIdState] = useState<string | null>(getSessionId());
    const [userId] = useState<string>(getOrCreateUserId());
    const [suggestedMessages, setSuggestedQuestions] = useState<string[]>([]);
    const [loadingSession, setLoadingSession] = useState(false);
    const [showingHistory, setShowingHistory] = useState(false);

    // Initialize chat messages with welcome message from widget settings when loaded
    useEffect(() => {
        const loadSession = async (sessionIdToLoad: string) => {
            setLoadingSession(true);
            try {
                const sessionMessages = await getUserSessionMessages(agent_uid, userId, sessionIdToLoad);

                if (sessionMessages.length > 0) {
                    const chatMessages: Message[] = [];
                    sessionMessages.forEach((msg) => {
                        chatMessages.push({
                            id: `user-${msg.id}`,
                            role: "user",
                            content: msg.human_message,
                            timestamp: new Date(msg.date_time)
                        });
                        chatMessages.push({
                            id: `assistant-${msg.id}`,
                            role: "assistant",
                            content: msg.ai_message,
                            timestamp: new Date(msg.date_time)
                        });
                    });
                    setMessages(chatMessages);
                } else {
                    // No messages in session, so remove session id and show initial message
                    removeSessionId();
                    setSessionIdState(null);
                    const initialMessage = widgetSettings?.initial_message || "Hello! How can I help you today?";
                    setMessages([{
                        id: '1',
                        role: 'assistant',
                        content: initialMessage,
                        timestamp: new Date(),
                    }]);
                }
            } catch (err) {
                console.error("Error loading session on mount:", err);
                removeSessionId();
                setSessionIdState(null);
                const initialMessage = widgetSettings?.initial_message || "Hello! How can I help you today?";
                setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: initialMessage,
                    timestamp: new Date(),
                }]);
            } finally {
                setLoadingSession(false);
            }
        };

        if (widgetSettings) {
            const existingSessionId = getSessionId();
            if (existingSessionId) {
                setSessionIdState(existingSessionId);
                loadSession(existingSessionId);
            } else {
                // Set initial messages from widget settings
                const initialMessage = widgetSettings.initial_message || "Hello! How can I help you today?";
                setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: initialMessage,
                    timestamp: new Date(),
                }]);
            }

            // Parse and set suggested messages if available
            if (widgetSettings.suggested_questions) {
                try {
                    // Parse suggested messages with newlines
                    const suggestedArray = widgetSettings.suggested_questions
                        .split('\n')
                        .map(msg => msg.trim())
                        .filter(Boolean);
                    setSuggestedQuestions(suggestedArray);
                } catch (error) {
                    console.error("Error parsing suggested messages:", error);
                }
            }
        }
    }, [widgetSettings, agent_uid, userId]);

    // Handle session selection from history
    const handleSessionSelect = async (selectedSessionId: string) => {
        if (selectedSessionId === sessionId) return;

        setLoadingSession(true);

        try {
            // Fetch messages for the selected session
            const sessionMessages = await getUserSessionMessages(agent_uid, userId, selectedSessionId);

            // Convert session messages to chat responses for display
            const chatMessages: Message[] = [];

            sessionMessages.forEach((msg) => {
                // Add user message
                chatMessages.push({
                    id: `user-${msg.id}`,
                    role: "user",
                    content: msg.human_message,
                    timestamp: new Date(msg.date_time)
                });

                // Add assistant message
                chatMessages.push({
                    id: `assistant-${msg.id}`,
                    role: "assistant",
                    content: msg.ai_message,
                    timestamp: new Date(msg.date_time)
                });
            });

            // Update state with the new session and messages
            setSessionId(selectedSessionId);
            setSessionIdState(selectedSessionId);
            setMessages(chatMessages);
        } catch (err) {
            console.error("Error loading session:", err);
            // Show error message as a system message
            setMessages([{
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, I couldn't load this conversation history.",
                timestamp: new Date()
            }]);
        } finally {
            setLoadingSession(false);
        }
    };

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

    // Send message function
    async function sendMessage(messageOverride?: string) {
        const messageText = messageOverride || input.trim();
        if ((!messageText || isLoading)) return;

        const userMessage: Message = {
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
            // Call the embedChat API with agent_uid from widget settings or URL params
            const effectiveAgentId = agent_uid;

            if (!effectiveAgentId) {
                throw new Error("No agent ID available");
            }
            const currentSessionId = sessionId || getSessionId();
            const response = await embedChatApi(
                agent_uid,
                {
                    session_id: currentSessionId || undefined,
                    user_uid: userId,
                    query: currentInput,
                    stream: false,
                });

            if (!currentSessionId) {
                setSessionId(response.session_id);
                setSessionIdState(response.session_id);
            }

            // Add bot response
            setMessages((prev) => [...prev, {
                id: response.id.toString(),
                role: "assistant",
                content: response.ai_message,
                timestamp: new Date(response.date_time)
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

    // Toggle history view
    const handleToggleHistory = () => {
        setShowingHistory(prev => !prev);
    };

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
                agentId={agent_uid}
                showingHistory={showingHistory}
                onToggleHistory={handleToggleHistory}
                onSessionSelect={handleSessionSelect}
            />

            {showingHistory ? (
                /* Session History View */
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
            ) : (
                /* Chat View */
                <>
                    {/* Messages Component */}
                    <MessageList
                        messages={messages}
                        isLoading={isLoading || loadingSession}
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
                </>
            )}
        </div>
    );
}
