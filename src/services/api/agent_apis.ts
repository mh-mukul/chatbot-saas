import { authApiClient } from "@/services/api/api_client";


export interface Pagination {
    current_page: number;
    total_pages: number;
    total_records: number;
    records_per_page: number;
    previous_page_url: string | null;
    next_page_url: string | null;
};

export interface Agent {
    uid: string;
    name: string;
    created_at: string;
    last_active?: Date;
    conversations?: number;
};

export interface AgentDetails {
    uid: string;
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    created_at: string;
    model_id: number | null;
    prompt_template_id: number | null;
};

export interface CreateAgentRequest {
    name: string;
};

export interface UpdateAgentRequest {
    name: string;
    system_prompt: string;
    model_temperature: number | 0;
    model_id: number;
    prompt_template_id: number | null;
};

export const getAgents = async (): Promise<{ agents: Agent[]; pagination: Pagination }> => {
    try {
        const response = await authApiClient.get('/api/v1/agents');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
};

export const getAgentById = async (uid: string): Promise<AgentDetails> => {
    try {
        const response = await authApiClient.get(`/api/v1/agents/${uid}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching agent with uid ${uid}:`, error);
        throw error;
    }
};

export const createAgent = async (agentData: CreateAgentRequest): Promise<AgentDetails> => {
    try {
        const response = await authApiClient.post('/api/v1/agents', agentData);
        return response.data.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

export const updateAgent = async (uid: string, agentData: Partial<UpdateAgentRequest>): Promise<AgentDetails> => {
    try {
        const response = await authApiClient.put(`/api/v1/agents/${uid}`, agentData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating agent with uid ${uid}:`, error);
        throw error;
    }
};

export const deleteAgent = async (uid: string): Promise<void> => {
    try {
        await authApiClient.delete(`/api/v1/agents/${uid}`);
    } catch (error) {
        console.error(`Error deleting agent with uid ${uid}:`, error);
        throw error;
    }
};