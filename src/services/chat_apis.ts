import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface chatResponse {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface playgroundChatRequest {
    agent_id: number;
    session_id: string;
    query: string;
    system_prompt: "You are a helpful assistant." | string;
    temperature: 0 | number;
    platform: "playground";
}

export const playgroundChat = async (data: playgroundChatRequest): Promise<chatResponse> => {
    try {
        const response = await apiClient.post('/api/chat', data);
        return response.data.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};