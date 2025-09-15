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
} from "@/services/source_apis";
import FileSourceTab from "@/components/agent/source/FileSourceTab";
import TextSourceTab from "@/components/agent/source/TextSourceTab";
import QnaSourceTab from "@/components/agent/source/QnaSourceTab";
import SourceDetails from "@/components/agent/source/SourceDetails";
import TrainingSummary from "@/components/agent/source/TrainingSummary";

type SourceDetailsType = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse | null;

const Sources = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [fileSources, setFileSources] = useState<fileSourceListResponse[]>([]);
  const [textSources, setTextSources] = useState<textSourceListResponse[]>([]);
  const [qnaSources, setQnaSources] = useState<qnaSourceListResponse[]>([]);

  const [selectedSource, setSelectedSource] = useState<SourceDetailsType>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const agentId = parseInt(id, 10);
      getFileSourceList(agentId).then(setFileSources);
      getTextSourceList(agentId).then(setTextSources);
      getQnaSourceList(agentId).then(setQnaSources);
    }
  }, [id]);

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
        <Tabs defaultValue="files" className="h-[calc(100vh-180px)]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6 space-y-4">
            <FileSourceTab
              fileSources={fileSources}
              onSourceClick={handleSourceClick}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-6 space-y-4">
            <TextSourceTab
              textSources={textSources}
              onSourceClick={handleSourceClick}
            />
          </TabsContent>

          <TabsContent value="qa" className="mt-6 space-y-4">
            <QnaSourceTab
              qnaSources={qnaSources}
              onSourceClick={handleSourceClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Summary & Actions */}
      <TrainingSummary
        fileSources={fileSources.length}
        textSources={textSources.length}
        qnaSources={qnaSources.length}
        onTrainAgent={handleTrainAgent}
      />
    </div>
  );
};

export default Sources;