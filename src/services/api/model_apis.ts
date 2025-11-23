import { authApiClient } from "@/services/api/api_client";


export interface Pagination {
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
};


export interface modelListResponse {
    id: number;
    model_name: string;
    code: string;
    provider: string;
    is_active: boolean;
    created_at: Date;
    icon: string | null;
};

export const getModelList = async (): Promise<{ models: modelListResponse[]; pagination: Pagination }> => {
    try {
        const response = await authApiClient.get(`/api/v1/models`);
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
};

export const getPromptTemplateList = async (): Promise<{ prompts: promptTemplateListResponse[]; pagination: Pagination }> => {
    try {
        const response = await authApiClient.get(`/api/v1/prompts`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching prompt templates:`, error);
        throw error;
    }
};