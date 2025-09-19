import { useState, useEffect } from "react";
import { getAgentById, updateAgent, AgentDetails } from "@/services/agent_apis";
import { getModelList, modelListResponse } from "@/services/model_apis";
import { useToast } from "@/hooks/use-toast";
import { clearSessionId } from '@/lib/utils';

export function useAgent(id: string | undefined) {
    const [agent, setAgent] = useState<AgentDetails | null>(null);
    const [initialAgent, setInitialAgent] = useState<AgentDetails | null>(null);
    const [models, setModels] = useState<modelListResponse[]>([]);
    const [selectedModel, setSelectedModel] = useState<modelListResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    // Helper functions to update agent state
    const setAgentName = (name: string) => setAgent(prev => prev ? ({ ...prev, name }) : null);
    const setTemperature = (value: number[]) => setAgent(prev => prev ? ({ ...prev, model_temperature: value[0] }) : null);
    const setSystemPrompt = (prompt: string) => setAgent(prev => prev ? ({ ...prev, system_prompt: prompt }) : null);

    useEffect(() => {
        clearSessionId(); // Clear previous session
        setIsLoading(true);

        const fetchData = async () => {
            try {
                // Fetch models first
                const modelsList = await getModelList();
                setModels(modelsList);

                if (id) {
                    // Then fetch agent details
                    const agentDetails = await getAgentById(Number(id));
                    setAgent(agentDetails);
                    setInitialAgent(agentDetails);

                    // Filter only active models
                    const activeModels = modelsList.filter(model => model.status === 'active');

                    // If agent has a model_id, preselect it if it's active
                    if (agentDetails.model_id && modelsList.length > 0) {
                        const agentModel = modelsList.find(model => model.id === agentDetails.model_id);

                        if (agentModel && agentModel.status === 'active') {
                            // Only select if the model is active
                            setSelectedModel(agentModel);
                        } else if (activeModels.length > 0) {
                            // If agent's model is not found or not active, select first active model
                            setSelectedModel(activeModels[0]);
                        }
                    } else if (activeModels.length > 0) {
                        // If no model_id is set, select first active model
                        setSelectedModel(activeModels[0]);
                    }
                }
            } catch (error) {
                toast({
                    title: "Error fetching data",
                    description: "Could not load required data. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, toast]);

    const isChanged = agent && initialAgent && selectedModel ?
        agent.name !== initialAgent.name ||
        agent.model_temperature !== initialAgent.model_temperature ||
        agent.system_prompt !== initialAgent.system_prompt ||
        initialAgent.model_id !== selectedModel.id
        : false;

    const handleSaveChanges = async () => {
        if (!agent || !id || !isChanged || !selectedModel) return;

        // Check if selected model is active before saving
        if (selectedModel.status !== 'active') {
            toast({
                title: "Invalid Model Selection",
                description: "Please select an active model before saving.",
                variant: "destructive",
            });
            return;
        }

        try {
            const updatedAgentData = await updateAgent(Number(id), {
                name: agent.name,
                system_prompt: agent.system_prompt,
                model_temperature: agent.model_temperature,
                model_id: selectedModel.id
            });
            setAgent(updatedAgentData);
            setInitialAgent(updatedAgentData);
            toast({
                title: "Agent Updated",
                description: "Your agent's settings have been saved.",
            });
        } catch (error) {
            toast({
                title: "Error Saving Agent",
                description: "Could not save changes. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleModelChange = (value: string) => {
        const model = models.find(m => m.id === parseInt(value));
        if (model && model.status === 'active') {
            setSelectedModel(model);
            setAgent(prev => prev ? ({ ...prev, model_id: parseInt(value) }) : null);
        }
    };

    return {
        agent,
        models,
        selectedModel,
        isLoading,
        isChanged,
        setAgentName,
        setTemperature,
        setSystemPrompt,
        handleModelChange,
        handleSaveChanges
    };
}
