import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Smile, RefreshCcw } from "lucide-react";
import { chatWidgetSettings } from "@/services/api/embed_chat_apis";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import "./WidgetTheme.css";
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

interface WidgetPreviewProps {
    widgetSettings: chatWidgetSettings;
}

const WidgetPreview = ({ widgetSettings }: WidgetPreviewProps) => {
    // Function to parse initial messages into an array of messages
    const parseInitialMessages = (messagesText: string | undefined): Array<{
        id: string;
        role: 'assistant';
        content: string;
        timestamp: Date;
    }> => {
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

    const [messages, setMessages] = useState<Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }>>(parseInitialMessages(widgetSettings.initial_message));

    const [currentMessage, setCurrentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [currentMessage]);

    const suggestedQuestions = widgetSettings.suggested_questions
        ? widgetSettings.suggested_questions.split('\n').filter(q => q.trim() !== '')
        : [];

    const handleSendMessage = async (customMessage?: string) => {
        // Use either the custom message or the current message in the input
        const messageToSend = customMessage?.trim() || currentMessage.trim();
        if (!messageToSend) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: messageToSend,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage("");
        setIsLoading(true);

        // Simulate bot response after a short delay
        setTimeout(() => {
            const botResponse = {
                id: (Date.now() + 1).toString(),
                role: 'assistant' as const,
                content: "This is a preview of how the chat widget will appear on your website. The actual responses will come from your trained AI agent.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1000);
    };

    const handleSuggestedQuestion = (question: string) => {
        // Send the suggested question directly without updating the input field
        handleSendMessage(question);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
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
                className={`flex flex-col h-[75vh] w-full max-w-md mx-auto border rounded-2xl bg-background shadow-lg relative mb-0 overflow-hidden ${widgetSettings.chat_theme}`}
                style={{ width: '28rem', maxWidth: '100%' }}
            >
                {/* Header */}
                <div className="px-4 py-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground scale-110"
                            style={widgetSettings.primary_color ?
                                { backgroundColor: widgetSettings.primary_color } : {}}
                        >
                            <ChatIcon />
                        </div>
                        <h2 className="font-medium">{widgetSettings.display_name || "Chat Assistant"}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 w-full">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${index > 0 ? "mt-4" : ""}
                                ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {message.role !== "user" && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                    <ChatIcon />
                                </div>
                            )}

                            <div className="flex flex-col max-w-[75%] min-w-0">
                                <div
                                    className={`rounded-2xl px-4 py-2 text-sm ${message.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none self-end"
                                        : "bg-muted text-foreground rounded-bl-none self-start"
                                        }`}
                                    style={message.role === "user" && widgetSettings.primary_color ?
                                        { backgroundColor: widgetSettings.primary_color } : {}}
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
                        <div className="flex gap-2 justify-start mt-4">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground"
                                style={widgetSettings.primary_color ?
                                    { backgroundColor: widgetSettings.primary_color } : {}}
                            >
                                <ChatIcon />
                            </div>
                            <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Suggested questions - positioned above the footer */}
                {!messages.some(msg => msg.role === 'user') && suggestedQuestions.length > 0 && (
                    <div className="px-3 py-2 flex flex-col items-end">
                        <div className="flex flex-wrap gap-2 justify-end">
                            {suggestedQuestions.map((question, index) => (
                                <div
                                    key={index}
                                    className="border border-muted hover:bg-muted/10 rounded-lg px-3 py-1.5 text-sm cursor-pointer max-w-fit text-foreground"
                                    onClick={() => handleSuggestedQuestion(question)}
                                >
                                    {question}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Input */}
                <div className="px-3 py-2.5 border-t w-full">
                    <div className="relative flex items-center w-full">
                        <Textarea
                            ref={textareaRef}
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={widgetSettings.message_placeholder || "Ask anything..."}
                            className="pr-20 rounded-2xl w-full min-h-[40px] max-h-[120px] resize-none custom-scrollbar"
                            disabled={isLoading}
                            rows={1}
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
                                    <div
                                        data-theme={widgetSettings.chat_theme}
                                        className={widgetSettings.chat_theme === 'dark' ? 'dark' : 'light'}
                                    >
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
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button
                            onClick={() => handleSendMessage()}
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
