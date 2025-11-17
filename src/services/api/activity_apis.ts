import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a request interceptor to include JWT token in the headers
apiClient.interceptors.request.use(
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

export interface Pagination {
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
}

export interface sessionListResponse {
    uid: string;
    user_uid: string;
    human_message: string;
    date_time: Date;
}

export const getSessionList = async (agent: string): Promise<{ sessions: sessionListResponse[], pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/activity/sessions/${agent}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${agent}:`, error);
        throw error;
    }
};

export interface sessionMessagesResponse {
    id: number;
    session_uid: string;
    human_message: string;
    ai_message: string;
    revised: boolean;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
}

export const getSessionMessages = async (agent: string, session: string): Promise<sessionMessagesResponse[]> => {
    try {
        const response = await apiClient.get(`/api/v1/activity/messages/${agent}/${session}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${session}:`, error);
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