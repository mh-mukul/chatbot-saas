import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Send, Bot, User, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Playground = () => {
  const { id } = useParams();
  const [agentName, setAgentName] = useState("Customer Support Bot");
  const [temperature, setTemperature] = useState([0.7]);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful customer support assistant. Be professional, empathetic, and provide clear solutions to customer problems."
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your customer support assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand your question. Based on the current configuration, I would recommend checking our documentation or contacting our technical team for more specific guidance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Configuration */}
      <div className="w-80 border-r border-border/50 bg-gradient-card/30 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuration
          </h2>
          <p className="text-sm text-muted-foreground">
            Adjust your agent's behavior and settings
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="agent-name" className="text-sm font-medium">
              Agent Name
            </Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              Temperature: {temperature[0]}
            </Label>
            <div className="mt-2">
              <Slider
                value={temperature}
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
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="mt-1 min-h-32"
              placeholder="Define how your agent should behave..."
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border/50 bg-gradient-card/20">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Test and interact with your AI agent
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-primary text-primary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <Card
                    className={`${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-card border-border/50"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 border-t border-border/50 bg-gradient-card/20">
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-gradient-primary hover:shadow-glow transition-spring"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;