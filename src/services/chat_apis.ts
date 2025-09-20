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
    system_prompt: string;
    temperature: 0 | number;
    model_provider: string;
    model_code: string;
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

export interface embedChatRequest {
    agent_id: string;
    session_id: string;
    query: string;
}

export const embedChat = async (data: embedChatRequest): Promise<chatResponse> => {
    try {
        const response = await apiClient.post('/api/embed-chat', data);
        return response.data.data;
    } catch (error) {
        console.error('Error invoking embed chat:', error);
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
    input: string;
    output: string;
    revised: boolean;
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

export interface reviseAnswerRequest {
    agent_id: number;
    chat_id: string;
    revised_answer: string;
}

export const reviseAnswer = async (data: reviseAnswerRequest): Promise<void> => {
    try {
        const response = await apiClient.post('/api/revise-answer', data);
        return response.data.data;
    } catch (error) {
        console.error('Error revising answer:', error);
        throw error;
    }
}

export interface reviseAnswerResponse {
    id: string;
    title: string;
    question: string;
    answer: string;
    created_at: Date;
}

export const getRevisedAnswer = async (chat_id: number): Promise<reviseAnswerResponse> => {
    try {
        const response = await apiClient.get(`/api/revise-answer?chat_id=${chat_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching revised answer with id ${chat_id}:`, error);
        throw error;
    }
};