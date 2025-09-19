import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAgentById, updateAgent, AgentDetails } from "@/services/agent_apis";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/hooks/use-chat';
import { clearSessionId } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import ChatUI from "@/components/agent/playground/ChatUI";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getModelList, modelListResponse } from "@/services/model_apis";
import { getAgentTrainingStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [initialAgent, setInitialAgent] = useState<AgentDetails | null>(null);
  const [models, setModels] = useState<modelListResponse[]>([]);
  const [selectedModel, setSelectedModel] = useState<modelListResponse | null>(null);
  const setAgentName = (name: string) => setAgent(prev => prev ? ({ ...prev, name }) : null);
  const setTemperature = (value: number[]) => setAgent(prev => prev ? ({ ...prev, model_temperature: value[0] }) : null);
  const setSystemPrompt = (prompt: string) => setAgent(prev => prev ? ({ ...prev, system_prompt: prompt }) : null);
  const { toast } = useToast();
  const [currentMessage, setCurrentMessage] = useState("");

  const agentId = agent ? agent.id : 0;
  const systemPrompt = agent ? agent.system_prompt : "You are a helpful assistant.";
  const temperature = agent ? agent.model_temperature : 0;
  const modelProvider = selectedModel ? selectedModel.provider : "";
  const modelCode = selectedModel ? selectedModel.code : "";

  const { messages, isLoading, sendMessage } = useChat(
    agentId,
    systemPrompt,
    temperature,
    modelProvider,
    modelCode
  );

  useEffect(() => {
    clearSessionId(); // Clear previous session

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
          console.log("Fetched Agent Details:", agentDetails);

          // Filter only active models
          const activeModels = modelsList.filter(model => model.status === 'active');

          // If agent has a model_id, preselect it if it's active
          if (agentDetails.model_id && modelsList.length > 0) {
            const agentModel = modelsList.find(model => model.id === agentDetails.model_id);
            console.log(agentModel);

            if (agentModel && agentModel.status === 'active') {
              // Only select if the model is active
              setSelectedModel(agentModel);
            } else if (activeModels.length > 0 && !selectedModel) {
              // If agent's model is not found or not active, select first active model
              setSelectedModel(activeModels[0]);
            }
          } else if (activeModels.length > 0 && !selectedModel) {
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
      // Assuming model_id can be passed to updateAgent or the backend already handles this
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    const messageToSend = currentMessage;
    setCurrentMessage(""); // Clear the input field immediately before sending
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Skeleton loader for the agent
  const AgentSkeleton = () => (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Configuration Skeleton */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6 space-y-6">
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-9 w-full" />

          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-40 mt-1" />
          </div>

          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Interface Skeleton */}
      <div className="flex-1 flex items-center justify-center dotted-background">
        <div className="flex flex-col h-[90vh] max-w-md w-full mx-auto border rounded-2xl bg-background shadow-lg">
          {/* Header Skeleton */}
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>

          {/* Messages Skeleton */}
          <div className="flex-1 p-4 space-y-4">
            {/* Bot message skeleton */}
            <div className="flex items-end gap-2 justify-start">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            {/* User message skeleton */}
            <div className="flex items-end gap-2 justify-end">
              <div className="flex flex-col gap-1 items-end">
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            {/* Bot message skeleton */}
            <div className="flex items-end gap-2 justify-start">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Footer Input Skeleton */}
          <div className="p-3 border-t flex gap-2 items-center">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!agent) {
    return <AgentSkeleton />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Configuration */}
      <ScrollArea className="h-[calc(100vh-80px)]">

        <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              Playground
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust the agent's parameter based on your needs. Make sure to save after making changes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Agent Status:</span>
              <Badge className={`${getAgentTrainingStatusColor(agent.training_status)} font-medium`}>
                {agent.training_status}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span>Last Trained:</span>
              <span className="text-sm text-gray-600">
                {agent.last_trained_at
                  ? formatDistanceToNow(new Date(agent.last_trained_at), { addSuffix: true })
                  : "Never"}
              </span>
            </div>
            <Button className="w-full" disabled={!isChanged} onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <div>
              <Label htmlFor="agent-name" className="text-sm font-medium">
                Agent Name
              </Label>
              <Input
                id="agent-name"
                value={agent.name || ""}
                onChange={(e) => setAgentName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="model-selection" className="text-sm font-medium">
                Model
              </Label>
              <Select
                value={selectedModel?.id.toString()}
                onValueChange={(value) => {
                  const model = models.find(m => m.id === parseInt(value));
                  if (model && model.status === 'active') {
                    setSelectedModel(model);
                    setAgent(prev => prev ? ({ ...prev, model_id: parseInt(value) }) : null);
                  }
                }}
                defaultValue={selectedModel?.id.toString()}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id.toString()}
                      disabled={model.status !== 'active'}
                    >
                      <div className="flex items-center gap-2">
                        {model.icon_url && (
                          <img
                            src={model.icon_url}
                            alt={model.model_name}
                            className="h-4 w-4 object-contain"
                          />
                        )}
                        <span>{model.model_name}</span>
                        {/* {model.status !== 'active' && (
                          <span className="text-xs text-muted-foreground ml-2">({model.status})</span>
                        )} */}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Model Temperature: {agent.model_temperature || 0}
              </Label>
              <div className="mt-2">
                <Slider
                  value={[agent.model_temperature || 0]}
                  onValueChange={setTemperature}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Controls randomness in responses
              </p>
            </div>

            <div>
              <Label htmlFor="system-prompt" className="text-sm font-medium">
                System Prompt
              </Label>
              <Textarea
                id="system-prompt"
                value={agent.system_prompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="mt-1 min-h-64"
                placeholder="Define how your agent should behave..."
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex items-center justify-center dotted-background">
        <ChatUI
          agentName={agent.name}
          messages={messages}
          isLoading={isLoading}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Playground;