import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Agent {
    id: number;
    name: string;
    training_status: "trained" | "training" | "not trained";
    created_at: string;
    last_active?: Date;
    conversations?: number;
}

export interface AgentDetails {
    id: number;
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    training_status: "trained" | "training" | "not trained";
    created_at: string;
    last_trained_at: string | null;
    model_id: number | null;
}

export interface CreateAgentRequest {
    name: string;
    system_prompt: string | "You are a helpful assistant.";
    model_temperature: number | 0;
}

export interface UpdateAgentRequest {
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    model_id: number;
}

export const getAgents = async (): Promise<Agent[]> => {
    try {
        const response = await apiClient.get('/api/agents');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
};

export const getAgentById = async (id: number): Promise<AgentDetails> => {
    try {
        const response = await apiClient.get(`/api/agents/?id=${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching agent with id ${id}:`, error);
        throw error;
    }
};

export const createAgent = async (agentData: Partial<CreateAgentRequest>): Promise<AgentDetails> => {
    try {
        const response = await apiClient.post('/api/agents', agentData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

export const updateAgent = async (id: number, agentData: Partial<UpdateAgentRequest>): Promise<AgentDetails> => {
    try {
        const response = await apiClient.put('/api/agents', { id, ...agentData });
        return response.data.data;
    } catch (error) {
        console.error(`Error updating agent with id ${id}:`, error);
        throw error;
    }
};

export const deleteAgent = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/api/agents`, { data: { id } });
    } catch (error) {
        console.error(`Error deleting agent with id ${id}:`, error);
        throw error;
    }
};