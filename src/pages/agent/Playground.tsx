import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAgentById, updateAgent, AgentDetails } from "@/services/agent_apis";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '@/hooks/use-chat';
import { clearSessionId } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import ChatUI from "@/components/agent/playground/ChatUI";


const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [initialAgent, setInitialAgent] = useState<AgentDetails | null>(null);
  const setAgentName = (name: string) => setAgent(prev => prev ? ({ ...prev, name }) : null);
  const setTemperature = (value: number[]) => setAgent(prev => prev ? ({ ...prev, temperature: value[0] }) : null);
  const setSystemPrompt = (prompt: string) => setAgent(prev => prev ? ({ ...prev, system_prompt: prompt }) : null);
  const { toast } = useToast();
  const [currentMessage, setCurrentMessage] = useState("");

  const agentId = agent ? agent.id : 0;
  const systemPrompt = agent ? agent.system_prompt : "You are a helpful assistant.";
  const temperature = agent ? agent.temperature : 0;

  const { messages, isLoading, sendMessage } = useChat(agentId, systemPrompt, temperature);

  useEffect(() => {
    clearSessionId(); // Clear previous session
    if (id) {
      const fetchAgentDetails = async () => {
        try {
          const agentDetails = await getAgentById(Number(id));
          setAgent(agentDetails);
          setInitialAgent(agentDetails);
        } catch (error) {
          toast({
            title: "Error fetching agent details",
            description: "Could not load agent data. Please try again later.",
            variant: "destructive",
          });
        }
      };

      fetchAgentDetails();
    }
  }, [id, toast]);

  const isChanged = agent && initialAgent ?
    agent.name !== initialAgent.name ||
    agent.temperature !== initialAgent.temperature ||
    agent.system_prompt !== initialAgent.system_prompt
    : false;

  const handleSaveChanges = async () => {
    if (!agent || !id || !isChanged) return;

    try {
      const updatedAgentData = await updateAgent(Number(id), {
        name: agent.name,
        system_prompt: agent.system_prompt,
        temperature: agent.temperature,
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
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 p-6">
          <div className="flex gap-3 justify-start mb-4">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <Card className="border-border/50">
              <CardContent className="p-3">
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-4 w-40 mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex gap-2">
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
              {agent.training_status === "trained" ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Trained
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {agent.training_status.charAt(0).toUpperCase() + agent.training_status.slice(1)}
                </span>
              )}
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
              <Label className="text-sm font-medium">
                Temperature: {agent.temperature || 0}
              </Label>
              <div className="mt-2">
                <Slider
                  value={[agent.temperature || 0]}
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