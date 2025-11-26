import { useState, useEffect, useCallback } from "react";
import {
    embedChat as embedChatApi,
    getUserSessionMessages,
    getChatWidgetSettings,
    chatWidgetSettings,
    Message,
} from "@/services/api/embed_chat_apis";
import { getSessionId, setSessionId, getOrCreateUserId, removeSessionId } from '@/lib/utils';
import { themeStyles as embedChatThemeStyles } from "@/components/embed-chat/theme-styles";

export const useEmbedChatSettings = (agentUid: string | null) => {
    const [widgetSettings, setWidgetSettings] = useState<chatWidgetSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!agentUid) {
                setError("Agent ID is required");
                setLoading(false);
                return;
            }

            try {
                const settings = await getChatWidgetSettings(agentUid);

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
    }, [agentUid]);

    return { widgetSettings, loading, error };
};

export const useEmbedChatTheme = (theme: string, widgetSettings: chatWidgetSettings | null) => {
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
};

export const useEmbedChatSession = (
    agentUid: string,
    widgetSettings: chatWidgetSettings | null
) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionIdState] = useState<string | null>(getSessionId());
    const [userId] = useState<string>(getOrCreateUserId());
    const [suggestedMessages, setSuggestedQuestions] = useState<string[]>([]);
    const [loadingSession, setLoadingSession] = useState(false);

    // Initialize chat messages with welcome message from widget settings when loaded
    useEffect(() => {
        const loadSession = async (sessionIdToLoad: string) => {
            setLoadingSession(true);
            try {
                const sessionMessages = await getUserSessionMessages(agentUid, userId, sessionIdToLoad);

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
    }, [widgetSettings, agentUid, userId]);

    // Handle session selection from history
    const handleSessionSelect = useCallback(async (selectedSessionId: string) => {
        if (selectedSessionId === sessionId) return;

        setLoadingSession(true);

        try {
            // Fetch messages for the selected session
            const sessionMessages = await getUserSessionMessages(agentUid, userId, selectedSessionId);

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
    }, [agentUid, userId, sessionId]);

    // Send message function
    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user" as const,
            content: messageText,
            timestamp: new Date()
        };

        // Add user message immediately
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Call the embedChat API with agent_uid from widget settings or URL params
            const effectiveAgentId = agentUid;

            if (!effectiveAgentId) {
                throw new Error("No agent ID available");
            }
            const currentSessionId = sessionId || getSessionId();
            const response = await embedChatApi(
                agentUid,
                {
                    session_id: currentSessionId || undefined,
                    user_uid: userId,
                    query: messageText,
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
    }, [agentUid, isLoading, sessionId, userId]);

    return {
        messages,
        setMessages,
        isLoading,
        sessionId,
        userId,
        suggestedMessages,
        loadingSession,
        handleSessionSelect,
        sendMessage
    };
};
