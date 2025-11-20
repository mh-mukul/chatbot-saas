import { authApiClient } from "@/services/api/api_client";


export interface chatResponse {
    session_id: string;
    human_message: string;
    ai_message: string;
    date_time: Date;
    duration: number;
    positive_feedback: boolean;
    negative_feedback: boolean;
};

export interface playgroundChatRequest {
    session_id: string | null;
    query: string;
    system_prompt: string;
    temperature: 0 | number;
    model_provider: string;
    model_id: number;
    platform: "playground";
};

export const playgroundChat = async (uid: string, data: playgroundChatRequest): Promise<chatResponse> => {
    try {
        const response = await authApiClient.post(`/api/v1/playground/chat/${uid}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error invoking agent:', error);
        throw error;
    }
};
