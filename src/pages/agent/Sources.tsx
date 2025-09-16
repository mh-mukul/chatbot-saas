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
} from "@/services/source_apis";
import FileSourceTab from "@/components/agent/source/FileSourceTab";
import TextSourceTab from "@/components/agent/source/TextSourceTab";
import QnaSourceTab from "@/components/agent/source/QnaSourceTab";
import SourceDetails from "@/components/agent/source/SourceDetails";
import TrainingSummary from "@/components/agent/source/TrainingSummary";
import { ScrollArea } from "@/components/ui/scroll-area";

type SourceDetailsType = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse | null;

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

  // Load summary when component mounts
  useEffect(() => {
    if (id) {
      const agentId = parseInt(id, 10);
      getSourceSummary(agentId).then(setSourceSummary).catch(err => {
        console.error("Error fetching source summary:", err);
        toast({
          title: "Error",
          description: "Could not fetch source summary.",
          variant: "destructive",
        });
      });
    }
  }, [id, toast]);

  // Load file sources only when the "files" tab is active
  useEffect(() => {
    if (id && activeTab === "files" && fileSources.length === 0) {
      const agentId = parseInt(id, 10);
      getFileSourceList(agentId)
        .then(setFileSources)
        .catch(err => {
          console.error("Error fetching file sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch file sources.",
            variant: "destructive",
          });
        });
    }
  }, [id, activeTab, fileSources.length, toast]);

  // Load text sources only when the "text" tab is active
  useEffect(() => {
    if (id && activeTab === "text" && textSources.length === 0) {
      const agentId = parseInt(id, 10);
      getTextSourceList(agentId)
        .then(setTextSources)
        .catch(err => {
          console.error("Error fetching text sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch text sources.",
            variant: "destructive",
          });
        });
    }
  }, [id, activeTab, textSources.length, toast]);

  // Load QnA sources only when the "qa" tab is active
  useEffect(() => {
    if (id && activeTab === "qa" && qnaSources.length === 0) {
      const agentId = parseInt(id, 10);
      getQnaSourceList(agentId)
        .then(setQnaSources)
        .catch(err => {
          console.error("Error fetching QnA sources:", err);
          toast({
            title: "Error",
            description: "Could not fetch QnA sources.",
            variant: "destructive",
          });
        });
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
        getFileSourceList(agentId).then(setFileSources);
      } else if (activeTab === "text") {
        getTextSourceList(agentId).then(setTextSources);
      } else if (activeTab === "qa") {
        getQnaSourceList(agentId).then(setQnaSources);
      }

      // Refresh summary
      getSourceSummary(agentId).then(setSourceSummary);
    }
  };

  const handleBackClick = () => {
    setSelectedSource(null);
    setSelectedSourceType(null);
  };

  const handleTrainAgent = () => {
    toast({
      title: "Training started",
      description: "Your agent is being trained with the latest sources.",
    });
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
                  <FileSourceTab
                    fileSources={fileSources}
                    onSourceClick={handleSourceClick}
                    agentId={parseInt(id!, 10)}
                    onSourceDeleted={handleSourceDeleted}
                    onSourceAdded={() => handleSourceAdded('file')}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="text" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  <TextSourceTab
                    textSources={textSources}
                    onSourceClick={handleSourceClick}
                    agentId={parseInt(id!, 10)}
                    onSourceDeleted={handleSourceDeleted}
                    onSourceAdded={() => handleSourceAdded('text')}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="qa" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  <QnaSourceTab
                    qnaSources={qnaSources}
                    onSourceClick={handleSourceClick}
                    agentId={parseInt(id!, 10)}
                    onSourceDeleted={handleSourceDeleted}
                    onSourceAdded={() => handleSourceAdded('Q&A')}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>      
      {/* Right Panel - Summary & Actions */}
      <TrainingSummary
        fileSources={sourceSummary?.files || 0}
        textSources={sourceSummary?.texts || 0}
        qnaSources={sourceSummary?.qnas || 0}
        trainingRequired={sourceSummary?.training_required || false}
        onTrainAgent={handleTrainAgent}
      />
    </div>
  );
};

export default Sources;