import { authApiClient } from "@/services/api/api_client";


export interface Pagination {
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
};

export interface sessionListResponse {
    uid: string;
    user_uid: string;
    human_message: string;
    date_time: Date;
};

export const getSessionList = async (agent: string): Promise<{ sessions: sessionListResponse[], pagination: Pagination }> => {
    try {
        const response = await authApiClient.get(`/api/v1/activity/sessions/${agent}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${agent}:`, error);
        throw error;
    }
};

export interface sessionMessagesResponse {
    id: number;
    session_id: string;
    human_message: string;
    ai_message: string;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
    qna_matched: boolean;
    status: string;
    revised: boolean | null;
    revised_ai_message: string | null;
};

export const getSessionMessages = async (agent: string, session: string): Promise<sessionMessagesResponse[]> => {
    try {
        const response = await authApiClient.get(`/api/v1/activity/messages/${agent}/${session}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${session}:`, error);
        throw error;
    }
};


export interface reviseAnswerRequest {
    session_id: string;
    revised_ai_message: string;
};

export const reviseAnswer = async (chat_id: number, data: reviseAnswerRequest): Promise<void> => {
    try {
        const response = await authApiClient.post(`/api/v1/chat/revise/${chat_id}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error revising answer:', error);
        throw error;
    }
};
