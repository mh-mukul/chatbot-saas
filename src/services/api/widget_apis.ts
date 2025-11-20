import { authApiClient } from "@/services/api/api_client";


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
        const response = await authApiClient.get(`/api/v1/widget/config/${agent_uid}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching chat widget settings for agent_uid ${agent_uid}:`, error);
        throw error;
    }
};

export const updateChatWidgetSettings = async (agent_uid: string, data: chatWidgetSettings, chatIconFile?: File): Promise<chatWidgetSettings> => {
    try {
        const formData = new FormData();

        // Append all settings as form fields
        formData.append('is_public', data.is_public.toString());
        formData.append('display_name', data.display_name);
        formData.append('initial_message', data.initial_message);
        formData.append('suggested_questions', data.suggested_questions);
        formData.append('message_placeholder', data.message_placeholder);
        formData.append('chat_theme', data.chat_theme);
        formData.append('chat_bubble_alignment', data.chat_bubble_alignment);
        formData.append('primary_color', data.primary_color);
        formData.append('secondary_color', data.secondary_color);

        // Only append file if a new file is provided
        if (chatIconFile) {
            formData.append('chat_icon', chatIconFile);
        }

        const response = await authApiClient.put(`/api/v1/widget/config/${agent_uid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error updating chat widget settings for agent_uid ${agent_uid}:`, error);
        throw error;
    }
};
