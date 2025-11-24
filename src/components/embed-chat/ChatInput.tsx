import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    isLoading: boolean;
    placeholder: string;
    primaryColor?: string;
}

export function ChatInput({
    input,
    setInput,
    sendMessage,
    isLoading,
    placeholder,
    primaryColor
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="px-3 py-2.5 border-t w-full">
            <div className="relative flex items-center w-full">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isLoading ? "Waiting for response..." : placeholder}
                    disabled={isLoading}
                    className="pr-20 rounded-2xl w-full min-h-[40px] max-h-[120px] resize-none custom-scrollbar"
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
                                className={
                                    (document.getElementById('embed-chat-container')?.getAttribute('data-theme') === 'dark')
                                        ? 'dark'
                                        : 'light'
                                }
                                data-theme={document.getElementById('embed-chat-container')?.getAttribute('data-theme') || 'light'}
                            >
                                <EmojiPicker
                                    className="h-[342px]"
                                    onEmojiSelect={({ emoji }) => {
                                        setInput(input + emoji);
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
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    variant="ghost"
                    size="icon"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
