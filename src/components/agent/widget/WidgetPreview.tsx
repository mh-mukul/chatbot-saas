import { useState, useEffect } from "react";
import { Send, Bot, User, Smile } from "lucide-react";
import { chatWidgetSettings } from "@/services/embed_chat_apis";
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
    }>>(parseInitialMessages(widgetSettings.initial_messages));

    const [currentMessage, setCurrentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const suggestedQuestions = widgetSettings.suggested_messages
        ? widgetSettings.suggested_messages.split('\n').filter(q => q.trim() !== '')
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
            const newInitialMessages = parseInitialMessages(widgetSettings.initial_messages);

            // If there are no user messages yet, just return the initial messages
            if (!prevMessages.some(msg => msg.role === 'user')) {
                return newInitialMessages;
            }

            // Otherwise, keep the conversation but replace the initial messages
            return [...newInitialMessages, ...nonInitialMessages];
        });
    }, [widgetSettings.initial_messages]);

    // Set theme based on widget settings
    useEffect(() => {
        const previewContainer = document.getElementById('widget-preview-container');
        if (previewContainer) {
            if (widgetSettings.chat_theme === 'dark') {
                previewContainer.classList.add('dark-theme');
                previewContainer.setAttribute('data-theme', 'dark');
            } else {
                previewContainer.classList.remove('dark-theme');
                previewContainer.setAttribute('data-theme', 'light');
            }
        }
    }, [widgetSettings.chat_theme]);

    // Determine icon to use
    const ChatIcon = () => {
        if (widgetSettings.chat_icon) {
            return (
                <img
                    src={widgetSettings.chat_icon}
                    alt="Chat icon"
                    className="h-4 w-4 object-contain"
                />
            );
        }
        return <Bot className="h-4 w-4" />;
    };


    // Chat bubble position classes
    const bubblePosition = widgetSettings.chat_allignment === "left" ? "left-4" : "right-4";

    return (
        <div className="relative flex flex-col pb-0">
            {/* Chat UI Centered */}
            <div
                id="widget-preview-container"
                className="flex flex-col h-[75vh] max-w-md w-full mx-auto border rounded-2xl bg-background shadow-lg relative mb-0 overflow-hidden"
            >
                {/* Header */}
                <div className="px-4 py-3 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <ChatIcon />
                        </div>
                        <h2 className="font-medium">{widgetSettings.display_name || "Chat Assistant"}</h2>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
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
                        <div className="flex gap-2 justify-start mt-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                <ChatIcon />
                            </div>
                            <div className="bg-muted text-foreground rounded-2xl px-4 py-2 text-sm">
                                Thinking...
                            </div>
                        </div>
                    )}
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
                <div className="px-3 py-2.5 border-t">
                    <div className="relative flex items-center">
                        <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={widgetSettings.message_placeholder || "Ask anything..."}
                            className="pr-20 rounded-full"
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

            {/* Floating Chat Bubble - moved outside the main container */}
            <div className="mt-0 relative w-full max-w-md">
                <div
                    className={`absolute top-0 z-50 ${bubblePosition}`}
                    style={{ transition: "left 0.3s, right 0.3s" }}
                >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-pointer border-4 border-background">
                        <ChatIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WidgetPreview;
