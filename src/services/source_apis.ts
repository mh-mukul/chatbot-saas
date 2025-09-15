import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface fileSourceListResponse {
    id: string;
    source_name: string;
}

export interface fileSourceDetailsResponse {
    id: string;
    source_name: string;
    source_content: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getFileSourceList = async (agent_id: number): Promise<fileSourceListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/sources/?agent=${agent_id}&type=file`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_id}:`, error);
        throw error;
    }
};

export const getFileSourceDetails = async (id: string): Promise<fileSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/sources?file_id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${id}:`, error);
        throw error;
    }
};

export interface textSourceListResponse {
    id: string;
    source_name: string;
}

export interface textSourceDetailsResponse {
    id: string;
    source_name: string;
    source_content: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getTextSourceList = async (agent_id: number): Promise<textSourceListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/sources/?agent=${agent_id}&type=text`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_id}:`, error);
        throw error;
    }
};

export const getTextSourceDetails = async (id: number): Promise<textSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/sources?file_id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${id}:`, error);
        throw error;
    }
};

export interface qnaSourceListResponse {
    id: string;
    title: string;
}

export interface qnaSourceDetailsResponse {
    id: string;
    title: string;
    questions: string;
    answer: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getQnaSourceList = async (agent_id: number): Promise<qnaSourceListResponse[]> => {
    try {
        const response = await apiClient.get(`/api/sources/?agent=${agent_id}&type=qna`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_id}:`, error);
        throw error;
    }
};

export const getQnaSourceDetails = async (id: number): Promise<qnaSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/sources?file_id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${id}:`, error);
        throw error;
    }
};