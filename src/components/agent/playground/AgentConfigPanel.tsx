import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentDetails } from "@/services/agent_apis";
import { formatDistanceToNow } from 'date-fns';
import { modelListResponse } from "@/services/model_apis";
import { getAgentTrainingStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentConfigPanelProps {
    agent: AgentDetails;
    models: modelListResponse[];
    selectedModel: modelListResponse | null;
    isChanged: boolean;
    onAgentNameChange: (name: string) => void;
    onTemperatureChange: (value: number[]) => void;
    onSystemPromptChange: (prompt: string) => void;
    onModelChange: (modelId: string) => void;
    onSaveChanges: () => Promise<void>;
}

const AgentConfigPanel = ({
    agent,
    models,
    selectedModel,
    isChanged,
    onAgentNameChange,
    onTemperatureChange,
    onSystemPromptChange,
    onModelChange,
    onSaveChanges
}: AgentConfigPanelProps) => {
    return (
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
                    <Button className="w-full" disabled={!isChanged} onClick={onSaveChanges}>
                        Save Changes
                    </Button>
                    <div>
                        <Label htmlFor="agent-name" className="text-sm font-medium">
                            Agent Name
                        </Label>
                        <Input
                            id="agent-name"
                            value={agent.name || ""}
                            onChange={(e) => onAgentNameChange(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="model-selection" className="text-sm font-medium">
                            Model
                        </Label>
                        <Select
                            value={selectedModel?.id.toString()}
                            onValueChange={onModelChange}
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
                                onValueChange={onTemperatureChange}
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
                            onChange={(e) => onSystemPromptChange(e.target.value)}
                            className="mt-1 min-h-64"
                            placeholder="Define how your agent should behave..."
                        />
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

export default AgentConfigPanel;
