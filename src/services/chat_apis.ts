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
        console.error('Error invoking agent:', error);
        throw error;
    }
};

export interface sessionListResponse {
    id: number;
    session_id: string;
    input: string;
    created_at: Date;
}

export const getSessionList = async (id: number): Promise<sessionListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/chat/sessions/?agent=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${id}:`, error);
        throw error;
    }
};

export interface sessionMessagesResponse {
    id: number;
    session_id: string;
    input: string;  // User's input message
    output: string; // Assistant's response message
    created_at: Date;
}

export const getSessionMessages = async (session_id: string): Promise<sessionMessagesResponse[]> => {
    try {
        const response = await apiClient.get(`/api/chats/?session=${session_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${session_id}:`, error);
        throw error;
    }
};