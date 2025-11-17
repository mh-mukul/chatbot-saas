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


export interface fileSourceListResponse {
    uid: string;
    title: string;
}

export interface fileSourceDetailsResponse {
    uid: string;
    title: string;
    content: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getFileSourceList = async (agent_uid: string): Promise<{ knowledge_sources: fileSourceListResponse[], pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/file`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_uid}:`, error);
        throw error;
    }
};

export const getFileSourceDetails = async (agent_uid: string, file_id: string): Promise<fileSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/file/${file_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${file_id}:`, error);
        throw error;
    }
};

export interface textSourceListResponse {
    uid: string;
    title: string;
}

export interface textSourceDetailsResponse {
    uid: string;
    title: string;
    content: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getTextSourceList = async (agent_uid: string): Promise<{ knowledge_sources: textSourceListResponse[], pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/text`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_uid}:`, error);
        throw error;
    }
};

export const getTextSourceDetails = async (agent_uid: string, file_id: string): Promise<textSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/text/${file_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${agent_uid}:`, error);
        throw error;
    }
};

export interface qnaSourceListResponse {
    uid: string;
    title: string;
}

export interface qnaSourceDetailsResponse {
    uid: string;
    title: string;
    questions: string[];
    answer: string;
    is_trained: boolean;
    created_at: Date;
    updated_at: Date;
}

export const getQnaSourceList = async (agent_uid: string): Promise<{ knowledge_sources: qnaSourceListResponse[], pagination: Pagination }> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/qna`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching sources with id ${agent_uid}:`, error);
        throw error;
    }
};

export const getQnaSourceDetails = async (agent_uid: string, file_id: string): Promise<qnaSourceDetailsResponse> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/${agent_uid}/qna/${file_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching source with id ${file_id}:`, error);
        throw error;
    }
};

export interface sourceSummaryResponse {
    files: number;
    texts: number;
    qnas: number;
    training_required: boolean;
}

export const getSourceSummary = async (agent_uid: string): Promise<sourceSummaryResponse> => {
    try {
        const response = await apiClient.get(`/api/v1/sources/summary/${agent_uid}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching summary with id ${agent_uid}:`, error);
        throw error;
    }
};


export const deleteSource = async (agent_uid: string, source_id: string): Promise<void> => {
    try {
        const response = await apiClient.delete(`/api/v1/sources/${agent_uid}/${source_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error deleting source with id ${source_id}:`, error);
        throw error;
    }
};

export interface uploadFileSourceRequest {
    file: File;
}

export const uploadFileSource = async (agent_uid: string, data: uploadFileSourceRequest): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('file', data.file);

        const response = await apiClient.post(`/api/v1/sources/file/${agent_uid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error uploading file source:`, error);
        throw error;
    }
}

export interface createTextSourceRequest {
    title: string;
    content: string;
}

export const createTextSource = async (agent_uid: string, data: createTextSourceRequest): Promise<void> => {
    try {
        const response = await apiClient.post(`/api/v1/sources/text/${agent_uid}`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error creating text source:`, error);
        throw error;
    }
}

export interface createQnaSourceRequest {
    title: string;
    questions: string[];
    answer: string;
}

export const createQnaSource = async (agent_uid: string, data: createQnaSourceRequest): Promise<void> => {
    try {
        const response = await apiClient.post(`/api/v1/sources/qna/${agent_uid}`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error creating QnA source:`, error);
        throw error;
    }
}

export interface trainSourcesRequest {
    agent_id: number;
}

export interface trainSourcesResponse {
    execution_id: number;
}

export const trainSources = async (data: trainSourcesRequest): Promise<trainSourcesResponse> => {
    try {
        const response = await apiClient.post(`/api/train-agent`, data);
        return response.data.data;
    } catch (error) {
        console.error(`Error training sources for agent id ${data.agent_id}:`, error);
        throw error;
    }
}

export interface trainProgressResponse {
    finished: boolean;
    status: string; // e.g., "running", "success", "failed"
}

export const getTrainingProgress = async (execution_id: number): Promise<trainProgressResponse> => {
    try {
        const response = await apiClient.get(`/api/training-progress?execution_id=${execution_id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching training progress for execution id ${execution_id}:`, error);
        throw error;
    }
}