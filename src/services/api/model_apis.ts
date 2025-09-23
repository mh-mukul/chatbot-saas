import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


export interface modelListResponse {
    id: number;
    model_name: string;
    code: string;
    provider: string;
    status: string;
    created_at: Date;
    icon_url: string | null;
}

export const getModelList = async (): Promise<modelListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/models`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching models:`, error);
        throw error;
    }
};

export interface promptTemplateListResponse {
    id: number;
    name: string;
    prompt: string;
    created_at: Date;
}

export const getPromptTemplateList = async (): Promise<promptTemplateListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/prompt-templates`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching prompt templates:`, error);
        throw error;
    }
};