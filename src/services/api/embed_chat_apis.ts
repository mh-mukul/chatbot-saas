import { apiClient } from "@/services/api/api_client";


export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};


export interface chatWidgetSettings {
    is_public: boolean;
    display_name: string;
    initial_message: string;
    suggested_questions: string;
    message_placeholder: string;
    chat_theme: "light" | "dark";
    chat_icon: string;
    chat_bubble_alignment: "left" | "right";
    primary_color: string;
    secondary_color: string;
};

export const getChatWidgetSettings = async (agent_uid: string): Promise<chatWidgetSettings> => {
    try {
        const response = await apiClient.get(`/api/v1/widget/config/${agent_uid}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching chat widget settings for agent_uid ${agent_uid}:`, error);
        throw error;
    }
};

export interface chatResponse {
    id: number;
    session_id: string;
    human_message: string;
    ai_message: string;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
};

export interface embedChatRequest {
    session_id: string | null;
    user_uid: string;
    query: string;
    stream: boolean | false;
};

export const embedChat = async (agent_uid: string, data: embedChatRequest): Promise<chatResponse> => {
    try {
        const { session_id, ...rest } = data;
        const payload: any = { ...rest };
        if (session_id) {
            payload.session_id = session_id;
        }
        const response = await apiClient.post(`/api/v1/chat/${agent_uid}`, payload);
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
};

export interface sessionListResponse {
    uid: string;
    // session_id: string;
    human_message: string;
    date_time: Date;
};

export const getUserSessionList = async (agent_uid: string, user: string): Promise<{ sessions: sessionListResponse[], pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/chat/sessions/${agent_uid}?user=${user}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${agent_uid}:`, error);
        throw error;
    }
};

export interface sessionMessagesResponse {
    id: number;
    session_id: string;
    human_message: string;
    ai_message: string;
    revised: boolean;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
};

export const getUserSessionMessages = async (agent: string, user: string, session: string): Promise<sessionMessagesResponse[]> => {
    try {
        const response = await apiClient.get(`/api/v1/chat/messages/${agent}?user=${user}&session_id=${session}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching session with id ${session}:`, error);
        throw error;
    }
};