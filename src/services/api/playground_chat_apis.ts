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
