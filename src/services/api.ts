import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface Agent {
    id: number;
    name: string;
    status: "trained" | "training" | "not trained";
    created_at: string;
    lastActive?: string;
    conversations?: number;
}

export interface AgentDetails {
    id: number;
    name: string;
    system_prompt: string;
    temperature: number | 0;
    status: "trained" | "training" | "not trained";
    created_at: string;
    last_trained_at: string | null;
}

export interface CreateUpdateAgentRequest {
    name: string;
    system_prompt: string;
    temperature: number | 0;
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

export const createAgent = async (agentData: Partial<CreateUpdateAgentRequest>): Promise<AgentDetails> => {
    try {
        const response = await apiClient.post('/api/agents', agentData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

export const updateAgent = async (id: number, agentData: Partial<CreateUpdateAgentRequest>): Promise<AgentDetails> => {
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