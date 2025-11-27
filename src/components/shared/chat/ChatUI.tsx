import { useState } from "react";
import { ChatUIProps } from "./types";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInputArea } from "./ChatInputArea";

export function ChatUI({ messages, isLoading, config, features, callbacks }: ChatUIProps) {
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const messageText = input;
        setInput("");
        await callbacks.onSendMessage(messageText);
    };

    const handleSuggestedQuestionClick = (question: string) => {
        if (features?.onSuggestedQuestionClick) {
            features.onSuggestedQuestionClick(question);
        } else {
            // Default behavior: send the question directly
            callbacks.onSendMessage(question);
        }
    };

    const showHeader = config?.showHeader !== false;
    const showEmojiPicker = features?.showEmojiPicker !== false;

    return (
        <div className={`flex flex-col h-full w-full bg-background border shadow-lg overflow-hidden ${config?.containerClassName || 'rounded-2xl'}`}>
            {/* Header */}
            {showHeader && (
                <ChatHeader
                    title={config?.displayName || "Chat Assistant"}
                    icon={config?.chatIcon}
                    actions={features?.headerActions}
                    config={config}
                />
            )}

            {/* Messages */}
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                config={config}
            />

            {/* Suggested Questions */}
            {features?.suggestedQuestions && features.suggestedQuestions.length > 0 && !isLoading && !messages.some(msg => msg.role === 'user') && (
                <div className="px-3 py-2 flex flex-col items-end">
                    <div className="flex flex-wrap gap-2 justify-end">
                        {features.suggestedQuestions.map((question, index) => (
                            <div
                                key={index}
                                className="border border-muted hover:bg-muted/10 rounded-lg px-3 py-1.5 text-sm cursor-pointer max-w-fit text-foreground transition-colors"
                                onClick={() => handleSuggestedQuestionClick(question)}
                            >
                                {question}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <ChatInputArea
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                config={config}
                showEmojiPicker={showEmojiPicker}
            />
        </div>
    );
}
