import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { chatWidgetSettings } from "@/services/api/embed_chat_apis";
import { ChatUI, ChatMessage } from "@/components/shared/chat";
import "./WidgetTheme.css";

interface WidgetPreviewProps {
    widgetSettings: chatWidgetSettings;
}

const WidgetPreview = ({ widgetSettings }: WidgetPreviewProps) => {
    // Function to parse initial messages into an array of messages
    const parseInitialMessages = (messagesText: string | undefined): ChatMessage[] => {
        if (!messagesText || messagesText.trim() === "") {
            return [{
                id: '1',
                role: 'assistant',
                content: "Hello! How can I help you today?",
                timestamp: new Date()
            }];
        }

        // Split by new line and filter out empty strings
        const messageLines = messagesText.split('\n').filter(line => line.trim() !== '');

        return messageLines.map((message, index) => ({
            id: `initial-${index}`,
            role: 'assistant' as const,
            content: message.trim(),
            timestamp: new Date(Date.now() - (messageLines.length - index) * 1000) // Stagger timestamps
        }));
    };

    const [messages, setMessages] = useState<ChatMessage[]>(parseInitialMessages(widgetSettings.initial_message));
    const [isLoading, setIsLoading] = useState(false);

    const suggestedQuestions = widgetSettings.suggested_questions
        ? widgetSettings.suggested_questions.split('\n').filter(q => q.trim() !== '')
        : [];

    const handleSendMessage = async (messageText: string) => {
        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Simulate bot response after a short delay
        setTimeout(() => {
            const botResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "This is a preview of how the chat widget will appear on your website. The actual responses will come from your trained AI agent.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    // Reset messages when initial_messages changes
    useEffect(() => {
        setMessages(prevMessages => {
            // Filter out any non-initial assistant messages and all user messages
            const nonInitialMessages = prevMessages.filter(msg =>
                (msg.role === 'user') ||
                (!msg.id.startsWith('initial-') && msg.role === 'assistant')
            );

            // Get the new initial messages
            const newInitialMessages = parseInitialMessages(widgetSettings.initial_message);

            // If there are no user messages yet, just return the initial messages
            if (!prevMessages.some(msg => msg.role === 'user')) {
                return newInitialMessages;
            }

            // Otherwise, keep the conversation but replace the initial messages
            return [...newInitialMessages, ...nonInitialMessages];
        });
    }, [widgetSettings.initial_message]);

    // Set theme based on widget settings - isolating from application theme
    useEffect(() => {
        const previewContainer = document.getElementById('widget-preview-container');
        const widgetBubble = document.getElementById('widget-bubble-container');

        if (previewContainer) {
            // Remove any existing theme classes
            previewContainer.classList.remove('light', 'dark', 'dark-theme');

            // Apply the theme directly from widget settings
            if (widgetSettings.chat_theme === 'dark') {
                previewContainer.classList.add('dark', 'dark-theme');
                previewContainer.setAttribute('data-theme', 'dark');
            } else {
                previewContainer.classList.add('light');
                previewContainer.setAttribute('data-theme', 'light');
            }

            // Apply primary color if available
            if (widgetSettings.primary_color) {
                previewContainer.style.setProperty('--primary', widgetSettings.primary_color);
            }
        }

        // Also apply theme to the chat bubble
        if (widgetBubble) {
            widgetBubble.classList.remove('light', 'dark', 'dark-theme');
            if (widgetSettings.chat_theme === 'dark') {
                widgetBubble.classList.add('dark', 'dark-theme');
                widgetBubble.setAttribute('data-theme', 'dark');
            } else {
                widgetBubble.classList.add('light');
                widgetBubble.setAttribute('data-theme', 'light');
            }

            // Apply primary color if available
            if (widgetSettings.primary_color) {
                widgetBubble.style.setProperty('--primary', widgetSettings.primary_color);
            }
        }
    }, [widgetSettings.chat_theme, widgetSettings.primary_color]);

    // Determine icon to use
    const ChatIcon = () => {
        if (widgetSettings.chat_icon) {
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

    // Chat bubble position classes
    const bubblePosition = widgetSettings.chat_bubble_alignment === "left" ? "left-1" : "right-1";

    return (
        <div className="relative flex flex-col pb-0 w-full">
            {/* Chat UI Centered - Using a data-theme attribute to isolate from application theme */}
            <div
                id="widget-preview-container"
                data-theme={widgetSettings.chat_theme}
                className={`h-[75vh] w-full max-w-md mx-auto relative mb-0 rounded-2xl overflow-hidden ${widgetSettings.chat_theme}`}
                style={{ width: '28rem', maxWidth: '100%' }}
            >
                <ChatUI
                    messages={messages}
                    isLoading={isLoading}
                    config={{
                        displayName: widgetSettings.display_name || "Chat Assistant",
                        placeholder: widgetSettings.message_placeholder || "Ask anything...",
                        theme: widgetSettings.chat_theme as 'light' | 'dark',
                        primaryColor: widgetSettings.primary_color,
                        chatIcon: <ChatIcon />,
                        showHeader: true,
                        showTimestamp: true
                    }}
                    features={{
                        suggestedQuestions: suggestedQuestions,
                        showEmojiPicker: true,
                    }}
                    callbacks={{
                        onSendMessage: handleSendMessage,
                    }}
                />
            </div>

            {/* Floating Chat Bubble - moved outside the main container but inherits theme */}
            <div className="mt-2 relative w-full max-w-md mx-auto">
                <div
                    id="widget-bubble-container"
                    className={`absolute top-0 z-50 ${bubblePosition}`}
                    style={{ transition: "left 0.3s, right 0.3s" }}
                    data-theme={widgetSettings.chat_theme}
                >
                    <div
                        className={`w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-pointer`}
                        style={widgetSettings.primary_color ?
                            { backgroundColor: widgetSettings.primary_color } : {}}
                    >
                        <div className="flex items-center justify-center rounded-full w-15 h-15 overflow-hidden">
                            {widgetSettings.chat_icon ? (
                                <img
                                    src={widgetSettings.chat_icon}
                                    alt="Chat icon"
                                    className="w-full h-full object-contain"
                                    style={{ aspectRatio: "1/1" }}
                                />
                            ) : (
                                <Bot className="h-8 w-8" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WidgetPreview;
