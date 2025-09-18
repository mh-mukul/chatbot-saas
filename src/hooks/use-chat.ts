import { useState } from 'react';
import { playgroundChat, playgroundChatRequest } from '@/services/chat_apis';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateSessionId } from '@/lib/utils';
import { chatResponse } from "@/services/chat_apis";


export const useChat = (
    agentId: number,
    systemPrompt: string,
    temperature: number,
    modelProvider: string = '',
    modelCode: string = ''
) => {
    const [messages, setMessages] = useState<chatResponse[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: chatResponse = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const sessionId = getOrCreateSessionId();
            const request: playgroundChatRequest = {
                agent_id: agentId,
                session_id: sessionId,
                query: content,
                system_prompt: systemPrompt,
                temperature: temperature,
                model_provider: modelProvider,
                model_code: modelCode,
                platform: 'playground',
            };

            const response = await playgroundChat(request);

            const assistantMessage: chatResponse = {
                id: response.id,
                role: 'assistant',
                content: response.content,
                timestamp: new Date(response.timestamp),
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
