import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MessageSquare, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  conversations: number;
  successRate: string;
  lastActive: string;
  category: string;
}

const Agents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets with high accuracy",
      status: "active",
      conversations: 1247,
      successRate: "98.5%",
      lastActive: "2 minutes ago",
      category: "Support"
    },
    {
      id: "2", 
      name: "Sales Assistant",
      description: "Qualifies leads and assists with product recommendations",
      status: "active",
      conversations: 892,
      successRate: "96.2%",
      lastActive: "15 minutes ago",
      category: "Sales"
    },
    {
      id: "3",
      name: "FAQ Bot",
      description: "Provides instant answers to frequently asked questions",
      status: "training",
      conversations: 568,
      successRate: "94.8%",
      lastActive: "1 hour ago",
      category: "Knowledge"
    },
    {
      id: "4",
      name: "Technical Support",
      description: "Helps users troubleshoot technical issues and problems",
      status: "active",
      conversations: 340,
      successRate: "92.1%",
      lastActive: "5 minutes ago",
      category: "Technical"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "inactive": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      case "training": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const deleteAgent = (id: string, name: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
    toast({
      title: "Agent deleted",
      description: `${name} has been successfully removed.`,
    });
  };

  const addNewAgent = () => {
    toast({
      title: "Feature coming soon",
      description: "Agent creation will be available in the next update.",
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your intelligent agents
          </p>
        </div>
        <Button 
          onClick={addNewAgent}
          className="bg-gradient-primary hover:shadow-glow transition-spring"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Agent
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.id}
            className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-spring cursor-pointer group"
            onClick={() => navigate(`/agent/${agent.id}/playground`)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-smooth">
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {agent.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/20 hover:text-destructive ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAgent(agent.id, agent.name);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Badge className={`${getStatusColor(agent.status)} font-medium`}>
                  {agent.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {agent.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium">{agent.conversations.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Conversations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">{agent.successRate}</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last active: {agent.lastActive}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for when no agents */}
      {agents.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first AI agent to get started
          </p>
          <Button 
            onClick={addNewAgent}
            className="bg-gradient-primary hover:shadow-glow transition-spring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Agent
          </Button>
        </div>
      )}
    </div>
  );
};

export default Agents;