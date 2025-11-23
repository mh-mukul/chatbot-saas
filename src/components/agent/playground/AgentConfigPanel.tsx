import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentDetails } from "@/services/api/agent_apis";
import { modelListResponse, promptTemplateListResponse } from "@/services/api/model_apis";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AgentConfigPanelProps {
    agent: AgentDetails;
    models: modelListResponse[];
    promptTemplates: promptTemplateListResponse[];
    selectedModel: modelListResponse | null;
    isChanged: boolean;
    onAgentNameChange: (name: string) => void;
    onTemperatureChange: (value: number[]) => void;
    onSystemPromptChange: (prompt: string) => void;
    onModelChange: (modelId: string) => void;
    onPromptTemplateChange: (templateId: string) => void;
    onSaveChanges: () => Promise<void>;
}

const AgentConfigPanel = ({
    agent,
    models,
    promptTemplates,
    selectedModel,
    isChanged,
    onAgentNameChange,
    onTemperatureChange,
    onSystemPromptChange,
    onModelChange,
    onPromptTemplateChange,
    onSaveChanges,
}: AgentConfigPanelProps) => {
    return (
        <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        Playground
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Adjust the parameters based on your needs & test. If you are satisfied, make sure to save the changes.
                    </p>
                </div>

                <div className="space-y-4">
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
                                        disabled={!model.is_active}
                                    >
                                        <div className="flex items-center gap-2">
                                            {model.icon && (
                                                <img
                                                    src={model.icon}
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
                        <Label htmlFor="prompt-template-selection" className="text-sm font-medium">
                            System Prompt
                        </Label>
                        <Select
                            value={agent.prompt_template_id?.toString() || "0"}
                            onValueChange={onPromptTemplateChange}
                        >
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground font-normal">Custom Prompt</SelectLabel>
                                    <SelectItem value="0">Custom Prompt</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel className="text-muted-foreground font-normal">Examples</SelectLabel>
                                    {promptTemplates.map((template) => (
                                        <SelectItem
                                            key={template.id}
                                            value={template.id.toString()}
                                        >
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="system-prompt" className="text-sm font-medium">
                            Instructions
                        </Label>
                        <Textarea
                            id="system-prompt"
                            value={agent.system_prompt}
                            onChange={(e) => onSystemPromptChange(e.target.value)}
                            className="mt-1 min-h-64"
                            placeholder="Define how your agent should behave..."
                        />
                    </div>
                    <Button className="w-full" disabled={!isChanged} onClick={onSaveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </ScrollArea>
    );
};

export default AgentConfigPanel;
