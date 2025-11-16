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


export interface modelListResponse {
    id: number;
    model_name: string;
    code: string;
    provider: string;
    is_active: boolean;
    created_at: Date;
    icon: string | null;
}

export const getModelList = async (): Promise<{ models: modelListResponse[]; pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/models`);
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

export const getPromptTemplateList = async (): Promise<{ prompts: promptTemplateListResponse[]; pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/prompts`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching prompt templates:`, error);
        throw error;
    }
};