import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface chatWidgetSettings {
    agent_id: number;
    is_private: boolean;
    display_name: string;
    initial_messages: string;
    suggested_messages: string;
    message_placeholder: string;
    chat_theme: "light" | "dark";
    chat_icon: string;
    chat_bubble_alignment: "left" | "right";
    primary_color: string;
}

export const getChatWidgetSettings = async (agent_id: number): Promise<chatWidgetSettings> => {
    try {
        const response = await apiClient.get(`/api/embed-chat/config/?agent_id=${agent_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching chat widget settings for agent_id ${agent_id}:`, error);
        throw error;
    }
}

export const updateChatWidgetSettings = async (data: chatWidgetSettings): Promise<chatWidgetSettings> => {
    try {
        const response = await apiClient.put(`/api/embed-chat/config`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating chat widget settings for agent_id ${data.agent_id}:`, error);
        throw error;
    }
}