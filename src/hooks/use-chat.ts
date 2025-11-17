import { useState } from 'react';
import { playgroundChat, playgroundChatRequest } from '@/services/api/chat_apis';
import { useToast } from '@/hooks/use-toast';
import { getSessionId, setSessionId } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const useChat = (
    agentId: string,
    systemPrompt: string,
    temperature: number,
    modelProvider: string = '',
    modelId: number
) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [sessionId, setSessionIdState] = useState<string | null>(getSessionId());
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const currentSessionId = sessionId || getSessionId();
            const request: playgroundChatRequest = {
                session_id: currentSessionId || undefined,
                query: content,
                system_prompt: systemPrompt,
                temperature: temperature,
                model_provider: modelProvider,
                model_id: modelId,
                platform: 'playground',
            };

            const response = await playgroundChat(agentId, request);

            if (!currentSessionId) {
                setSessionId(response.session_id);
                setSessionIdState(response.session_id);
            }

            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: response.ai_message,
                timestamp: new Date(response.date_time),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            toast({
                title: 'Error sending message',
                description: 'Could not get a response from the agent. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage };
};
