import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileSourceTab from "@/components/agent/source/FileSourceTab";
import TextSourceTab from "@/components/agent/source/TextSourceTab";
import QnaSourceTab from "@/components/agent/source/QnaSourceTab";
import SourceSkeletonLoader from "./common/SourceSkeletonLoader";
import EmptyState from "./common/EmptyState";
import { fileSourceListResponse, qnaSourceListResponse, textSourceListResponse } from "@/services/api/source_apis";

interface SourceTabsProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
    fileSources: fileSourceListResponse[];
    textSources: textSourceListResponse[];
    qnaSources: qnaSourceListResponse[];
    isLoadingFileSources: boolean;
    isLoadingTextSources: boolean;
    isLoadingQnaSources: boolean;
    handleSourceClick: (sourceId: string, type: string) => void;
    agentId: number;
    handleSourceDeleted: () => void;
    handleSourceAdded: (sourceType: string) => void;
}

const SourceTabs = ({
    activeTab,
    setActiveTab,
    fileSources,
    textSources,
    qnaSources,
    isLoadingFileSources,
    isLoadingTextSources,
    isLoadingQnaSources,
    handleSourceClick,
    agentId,
    handleSourceDeleted,
    handleSourceAdded,
}: SourceTabsProps) => {
    return (
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
                                        agentId={agentId}
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
                                        agentId={agentId}
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
                                        agentId={agentId}
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
    );
};

export default SourceTabs;
