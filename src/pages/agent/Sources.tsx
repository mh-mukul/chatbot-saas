import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getFileSourceList,
  getTextSourceList,
  getQnaSourceList,
  fileSourceListResponse,
  textSourceListResponse,
  qnaSourceListResponse,
  getFileSourceDetails,
  getTextSourceDetails,
  getQnaSourceDetails,
  fileSourceDetailsResponse,
  textSourceDetailsResponse,
  qnaSourceDetailsResponse,
  getSourceSummary,
  sourceSummaryResponse,
  trainSources,
  getTrainingProgress,
} from "@/services/source_apis";
import FileSourceTab from "@/components/agent/source/FileSourceTab";
import TextSourceTab from "@/components/agent/source/TextSourceTab";
import QnaSourceTab from "@/components/agent/source/QnaSourceTab";
import SourceDetails from "@/components/agent/source/SourceDetails";
import SourceSummary from "@/components/agent/source/SourceSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Text, MessageCircleQuestion } from "lucide-react";

type SourceDetailsType = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse | null;

// Skeleton loader component for source cards
const SourceSkeletonLoader = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    ))}
  </div>
);

// Empty state component for source tabs
interface EmptyStateProps {
  type: 'files' | 'text' | 'qa';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'files': return <FileText className="h-6 w-6 text-muted-foreground" />;
      case 'text': return <Text className="h-6 w-6 text-muted-foreground" />;
      case 'qa': return <MessageCircleQuestion className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'files': return "No file sources yet";
      case 'text': return "No text sources yet";
      case 'qa': return "No Q&A pairs yet";
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'files': return "Use the form above to upload files";
      case 'text': return "Use the form above to add text content";
      case 'qa': return "Use the form above to add Q&A pairs";
    }
  };

  return (
    <div className="text-center py-8 border border-dashed rounded-lg mt-6">
      <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
        {getIcon()}
      </div>
      <h3 className="text-md font-medium mb-1">{getTitle()}</h3>
      <p className="text-sm text-muted-foreground">
        {getMessage()}
      </p>
    </div>
  );
};

const Sources = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("files");
  const [fileSources, setFileSources] = useState<fileSourceListResponse[]>([]);
  const [textSources, setTextSources] = useState<textSourceListResponse[]>([]);
  const [qnaSources, setQnaSources] = useState<qnaSourceListResponse[]>([]);
  const [sourceSummary, setSourceSummary] = useState<sourceSummaryResponse | null>(null);

  const [selectedSource, setSelectedSource] = useState<SourceDetailsType>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);

  // Loading states
  const [isLoadingFileSources, setIsLoadingFileSources] = useState(false);
  const [isLoadingTextSources, setIsLoadingTextSources] = useState(false);
  const [isLoadingQnaSources, setIsLoadingQnaSources] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // Load summary when component mounts
  useEffect(() => {
    if (id) {
      const agentId = parseInt(id, 10);
      setIsLoadingSummary(true);
      getSourceSummary(agentId)
        .then(setSourceSummary)
        .catch(err => {
          console.error("Error fetching source summary:", err);
          toast({
            title: "Error",
            description: "Could not fetch source summary.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoadingSummary(false));
    }
  }, [id, toast]);

  // Load file sources only when the "files" tab is active
  useEffect(() => {
    if (id && activeTab === "files" && fileSources.length === 0) {
      const agentId = parseInt(id, 10);
      setIsLoadingFileSources(true);
      getFileSourceList(agentId)
        .then(setFileSources)
        .catch(err => {
          console.error("Error fetching file sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch file sources.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoadingFileSources(false));
    }
  }, [id, activeTab, fileSources.length, toast]);

  // Load text sources only when the "text" tab is active
  useEffect(() => {
    if (id && activeTab === "text" && textSources.length === 0) {
      const agentId = parseInt(id, 10);
      setIsLoadingTextSources(true);
      getTextSourceList(agentId)
        .then(setTextSources)
        .catch(err => {
          console.error("Error fetching text sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch text sources.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoadingTextSources(false));
    }
  }, [id, activeTab, textSources.length, toast]);

  // Load QnA sources only when the "qa" tab is active
  useEffect(() => {
    if (id && activeTab === "qa" && qnaSources.length === 0) {
      const agentId = parseInt(id, 10);
      setIsLoadingQnaSources(true);
      getQnaSourceList(agentId)
        .then(setQnaSources)
        .catch(err => {
          console.error("Error fetching QnA sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch QnA sources.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoadingQnaSources(false));
    }
  }, [id, activeTab, qnaSources.length, toast]);

  const handleSourceClick = async (sourceId: string, type: string) => {
    setSelectedSourceType(type);
    try {
      let details: SourceDetailsType = null;
      if (type === 'file') {
        details = await getFileSourceDetails(sourceId);
      } else if (type === 'text') {
        details = await getTextSourceDetails(sourceId);
      } else if (type === 'qna') {
        details = await getQnaSourceDetails(sourceId);
      }
      setSelectedSource(details);
    } catch (error) {
      console.error("Error fetching source details:", error);
      toast({
        title: "Error",
        description: "Could not fetch source details.",
        variant: "destructive",
      });
    }
  };

  const handleSourceDeleted = () => {
    toast({
      title: "Source deleted",
      description: "The source has been successfully deleted.",
    });

    // Refresh sources after deletion
    refreshSources();
  };

  const handleSourceAdded = (sourceType: string) => {
    toast({
      title: "Source added",
      description: `New ${sourceType} source has been successfully added.`,
    });

    // Refresh sources after addition
    refreshSources();
  };

  // Common function to refresh sources
  const refreshSources = () => {
    if (id) {
      const agentId = parseInt(id, 10);
      if (activeTab === "files") {
        setIsLoadingFileSources(true);
        getFileSourceList(agentId)
          .then(setFileSources)
          .finally(() => setIsLoadingFileSources(false));
      } else if (activeTab === "text") {
        setIsLoadingTextSources(true);
        getTextSourceList(agentId)
          .then(setTextSources)
          .finally(() => setIsLoadingTextSources(false));
      } else if (activeTab === "qa") {
        setIsLoadingQnaSources(true);
        getQnaSourceList(agentId)
          .then(setQnaSources)
          .finally(() => setIsLoadingQnaSources(false));
      }

      // Refresh summary
      setIsLoadingSummary(true);
      getSourceSummary(agentId)
        .then(setSourceSummary)
        .finally(() => setIsLoadingSummary(false));
    }
  };

  const handleBackClick = () => {
    setSelectedSource(null);
    setSelectedSourceType(null);
  };

  const handleTrainAgent = async () => {
    if (!id) return;

    setIsTraining(true);
    try {
      // Start the training process
      const agentId = parseInt(id, 10);
      const trainingResult = await trainSources({ agent_id: agentId });
      const executionId = trainingResult.execution_id;

      toast({
        title: "Training started",
        description: "Your agent is being trained with the latest sources.",
      });

      // Poll for training status every 3 seconds for up to 30 seconds
      const maxAttempts = 10; // 30 seconds total (10 attempts × 3 seconds)
      let attempts = 0;

      const checkTrainingProgress = async () => {
        try {
          const progress = await getTrainingProgress(executionId);

          if (progress.finished) {
            setIsTraining(false);

            if (progress.status === "success") {
              toast({
                title: "Training completed",
                description: "Your agent has been successfully trained with the latest sources.",
              });

              // Refresh the source summary after training
              refreshSources();
            } else {
              toast({
                title: "Training failed",
                description: "There was an error training your agent. Please try again.",
                variant: "destructive",
              });
            }

            return; // Exit the polling loop
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkTrainingProgress, 3000); // Check again after 3 seconds
          } else {
            // Max attempts reached, but don't stop showing loading state
            // as training might still be in progress
            toast({
              title: "Training in progress",
              description: "Training is still in progress. You'll be notified when it's complete.",
            });
          }
        } catch (error) {
          console.error("Error checking training progress:", error);
          setIsTraining(false);
          toast({
            title: "Error",
            description: "Could not check training progress. Please try again.",
            variant: "destructive",
          });
        }
      };

      // Start polling
      setTimeout(checkTrainingProgress, 3000);

    } catch (error) {
      console.error("Error starting training:", error);
      setIsTraining(false);
      toast({
        title: "Error",
        description: "Could not start training. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (selectedSource && selectedSourceType) {
    return (
      <SourceDetails
        selectedSource={selectedSource}
        selectedSourceType={selectedSourceType}
        onBackClick={handleBackClick}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Tabs */}
      <div className="flex-1 p-6">
        <Tabs
          defaultValue="files"
          className="h-[calc(100vh-120px)] flex flex-col"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-6">
            <TabsContent value="files" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  {isLoadingFileSources ? (
                    <SourceSkeletonLoader />
                  ) : (
                    <FileSourceTab
                      fileSources={fileSources}
                      onSourceClick={handleSourceClick}
                      agentId={parseInt(id!, 10)}
                      onSourceDeleted={handleSourceDeleted}
                      onSourceAdded={() => handleSourceAdded('file')}
                    />
                  )}
                  {!isLoadingFileSources && fileSources.length === 0 && (
                    <EmptyState type="files" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="text" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  {isLoadingTextSources ? (
                    <SourceSkeletonLoader />
                  ) : (
                    <TextSourceTab
                      textSources={textSources}
                      onSourceClick={handleSourceClick}
                      agentId={parseInt(id!, 10)}
                      onSourceDeleted={handleSourceDeleted}
                      onSourceAdded={() => handleSourceAdded('text')}
                    />
                  )}
                  {!isLoadingTextSources && textSources.length === 0 && (
                    <EmptyState type="text" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="qa" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  {isLoadingQnaSources ? (
                    <SourceSkeletonLoader />
                  ) : (
                    <QnaSourceTab
                      qnaSources={qnaSources}
                      onSourceClick={handleSourceClick}
                      agentId={parseInt(id!, 10)}
                      onSourceDeleted={handleSourceDeleted}
                      onSourceAdded={() => handleSourceAdded('Q&A')}
                    />
                  )}
                  {!isLoadingQnaSources && qnaSources.length === 0 && (
                    <EmptyState type="qa" />
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      {/* Right Panel - Summary & Actions */}
      {isLoadingSummary ? (
        <div className="w-64 lg:w-80 shrink-0 bg-muted/30 p-6 flex flex-col h-[calc(100vh-120px)]">
          <h3 className="font-medium mb-6 flex items-center">
            <Skeleton className="h-6 w-40" />
          </h3>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="pt-6">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <SourceSummary
          fileSources={sourceSummary?.files || 0}
          textSources={sourceSummary?.texts || 0}
          qnaSources={sourceSummary?.qnas || 0}
          trainingRequired={sourceSummary?.training_required || false}
          isTraining={isTraining}
          onTrainAgent={handleTrainAgent}
        />
      )}
    </div>
  );
};

export default Sources;