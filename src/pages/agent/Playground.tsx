import { useParams } from "react-router-dom";
import AgentConfigPanel from "@/components/agent/playground/AgentConfigPanel";
import AgentSkeleton from "@/components/agent/playground/AgentSkeleton";
import ChatPanel from "@/components/agent/playground/ChatPanel";
import { useAgent } from "@/hooks/use-agent";
import { useChat } from "@/hooks/use-chat";

const Playground = () => {
  const { id } = useParams<{ id: string }>();

  // Use our custom hook to handle agent data and configuration
  const {
    agent,
    models,
    selectedModel,
    isChanged,
    setAgentName,
    setTemperature,
    setSystemPrompt,
    handleModelChange,
    handleSaveChanges
  } = useAgent(id);

  // Set up the chat parameters based on agent data
  const chatParams = {
    agentId: agent?.id || 0,
    systemPrompt: agent?.system_prompt || "You are a helpful assistant.",
    temperature: agent?.model_temperature || 0,
    modelProvider: selectedModel?.provider || "",
    modelCode: selectedModel?.code || ""
  };

  // Use our custom hook for chat functionality
  const { messages, isLoading, sendMessage } =
    useChat(
      chatParams.agentId,
      chatParams.systemPrompt,
      chatParams.temperature,
      chatParams.modelProvider,
      chatParams.modelCode
    );

  if (!agent) {
    return <AgentSkeleton />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Configuration */}
      <AgentConfigPanel
        agent={agent}
        models={models}
        selectedModel={selectedModel}
        isChanged={isChanged}
        onAgentNameChange={setAgentName}
        onTemperatureChange={setTemperature}
        onSystemPromptChange={setSystemPrompt}
        onModelChange={handleModelChange}
        onSaveChanges={handleSaveChanges}
      />

      {/* Right Panel - Chat Interface */}
      <ChatPanel
        agentName={agent.name}
        messages={messages}
        isLoading={isLoading}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Playground;
