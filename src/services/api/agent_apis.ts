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

export interface Pagination{
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
}


export interface Agent {
    uid: string;
    name: string;
    training_status: "trained" | "training" | "not trained";
    created_at: string;
    last_active?: Date;
    conversations?: number;
}

export interface AgentDetails {
    uid: string;
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    training_status: "trained" | "training" | "not trained";
    created_at: string;
    last_trained_at: string | null;
    model_id: number | null;
    prompt_template_id: number | null;
}

export interface CreateAgentRequest {
    name: string;
}

export interface UpdateAgentRequest {
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    model_id: number;
    prompt_template_id: number | null;
}

export const getAgents = async (): Promise<{ agents: Agent[]; pagination: Pagination }> => {
    try {
        const response = await apiClient.get('/api/v1/agents');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
};

export const getAgentById = async (uid: string): Promise<AgentDetails> => {
    try {
        const response = await apiClient.get(`/api/v1/agents/${uid}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching agent with uid ${uid}:`, error);
        throw error;
    }
};

export const createAgent = async (agentData: CreateAgentRequest): Promise<AgentDetails> => {
    try {
        const response = await apiClient.post('/api/v1/agents', agentData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

export const updateAgent = async (uid: string, agentData: Partial<UpdateAgentRequest>): Promise<AgentDetails> => {
    try {
        const response = await apiClient.put(`/api/v1/agents/${uid}`, agentData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating agent with uid ${uid}:`, error);
        throw error;
    }
};

export const deleteAgent = async (uid: string): Promise<void> => {
    try {
        await apiClient.delete(`/api/v1/agents/${uid}`);
    } catch (error) {
        console.error(`Error deleting agent with uid ${uid}:`, error);
        throw error;
    }
};