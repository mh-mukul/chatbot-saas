import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAgents, Agent, deleteAgent as deleteAgentApi, createAgent as createAgentApi } from "@/services/api/agent_apis";
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const Agents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const response = await getAgents();
        // Handle case when response data is empty or undefined
        console.log("Fetched agents:", response.agents);
        setAgents(Array.isArray(response.agents) ? response.agents : []);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error fetching agents",
          description: "Could not load agent data. Please try again later.",
          variant: "destructive",
        });
        setAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [toast]);

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;

    try {
      await deleteAgentApi(agentToDelete.uid);
      setAgents(agents.filter(agent => agent.uid !== agentToDelete.uid));
      toast({
        title: "Agent deleted",
        description: `${agentToDelete.name} has been successfully removed.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting agent",
        description: `Could not delete ${agentToDelete.name}. Please try again later.`,
        variant: "destructive",
      });
    } finally {
      setAgentToDelete(null);
    }
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast({
        title: "Agent name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAgent = await createAgentApi({ name: newAgentName });
      setAgents(prev => [...prev, newAgent]);
      toast({
        title: "Agent Created",
        description: `Successfully created ${newAgent.name}.`,
      });
      navigate(`/agent/${newAgent.uid}/playground`);
    } catch (error) {
      toast({
        title: "Error creating agent",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreateDialogOpen(false);
      setNewAgentName("");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text">
            AI Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your intelligent agents
          </p>
        </div>
        {agents.length > 0 && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="transition-spring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Agent
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader className="pb-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-2 mt-4">
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-12 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Agents Grid - Only shown when there are agents */}
          {agents && agents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card
                  key={agent.uid}
                  className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-spring cursor-pointer group"
                  onClick={() => navigate(`/agent/${agent.uid}/playground`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-smooth">
                          {agent.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/20 hover:text-destructive ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAgentToDelete(agent);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium">{agent.conversations ? agent.conversations.toLocaleString() : '0'}</p>
                          <p className="text-xs text-muted-foreground">Conversations</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Last active: {agent.last_active ? formatDistanceToNow(new Date(agent.last_active), { addSuffix: true }) : 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State - Shown when there are no agents
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first AI agent to get started
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New AI Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Give your new agent a name. You can change this later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Customer Support Bot"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAgent()}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateAgent}>Create Agent</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!agentToDelete} onOpenChange={() => setAgentToDelete(null)}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agent "{agentToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Agents;