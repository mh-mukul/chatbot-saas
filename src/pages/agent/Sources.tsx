import { useParams } from "react-router-dom";
import { useSources } from "@/hooks/use-sources";
import SourceDetails from "@/components/agent/source/SourceDetails";
import SourceSummary from "@/components/agent/source/SourceSummary";
import SourceTabs from "@/components/agent/source/SourceTabs";
import { Skeleton } from "@/components/ui/skeleton";

const Sources = () => {
  const { id } = useParams<{ id: string }>();
  const {
    activeTab,
    setActiveTab,
    fileSources,
    textSources,
    qnaSources,
    sourceSummary,
    selectedSource,
    selectedSourceType,
    isLoadingFileSources,
    isLoadingTextSources,
    isLoadingQnaSources,
    isLoadingSummary,
    handleSourceClick,
    handleSourceDeleted,
    handleSourceAdded,
    handleBackClick,
  } = useSources(id);


  if (selectedSource && selectedSourceType) {
    return (
      <SourceDetails
        selectedSource={selectedSource}
        selectedSourceType={selectedSourceType}
        onBackClick={handleBackClick}
      />
    );
  }
  console.log(sourceSummary);

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Tabs */}
      <SourceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fileSources={fileSources}
        textSources={textSources}
        qnaSources={qnaSources}
        isLoadingFileSources={isLoadingFileSources}
        isLoadingTextSources={isLoadingTextSources}
        isLoadingQnaSources={isLoadingQnaSources}
        handleSourceClick={handleSourceClick}
        agentId={id}
        handleSourceDeleted={handleSourceDeleted}
        handleSourceAdded={handleSourceAdded}
      />
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
          fileStatus={sourceSummary?.file || { failed: 0, pending: 0, processed: 0, processing: 0 }}
          textStatus={sourceSummary?.text || { pending: 0, processing: 0 }}
          qnaStatus={sourceSummary?.qna || { pending: 0, processing: 0 }}
        />
      )}
    </div>
  );
};

export default Sources;
