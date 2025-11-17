import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const authAPIClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include JWT token in the headers
authAPIClient.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface chatResponse {
    session_id: string;
    human_message: string;
    ai_message: string;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
}

export interface playgroundChatRequest {
    session_id: string | null;
    query: string;
    system_prompt: string;
    temperature: 0 | number;
    model_provider: string;
    model_id: number;
    platform: "playground";
}

export const playgroundChat = async (uid: string, data: playgroundChatRequest): Promise<chatResponse> => {
    try {
        const response = await authAPIClient.post(`/api/v1/playground/chat/${uid}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error invoking agent:', error);
        throw error;
    }
};

export interface embedChatRequest {
    agent_id: string;
    session_id: string;
    user_id: string;
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

export interface Pagination {
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
}

export interface sessionListResponse {
    id: number;
    session_id: string;
    input: string;
    created_at: Date;
}

export const getUserSessionList = async (agent: number, user: string): Promise<sessionListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/user-chat/sessions/?agent=${agent}&user=${user}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${agent}:`, error);
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

export const getUserSessionMessages = async (session: string): Promise<sessionMessagesResponse[]> => {
    try {
        const response = await apiClient.get(`/api/v1/chat/messages/?session=${session}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${session}:`, error);
        throw error;
    }
};
