import { useState, useEffect } from "react";
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
} from "@/services/api/source_apis";

type SourceDetailsType = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse | null;

export const useSources = (id: string | undefined) => {
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
            const agentId = id;
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
            const agentId = id;
            setIsLoadingFileSources(true);
            getFileSourceList(agentId)
                .then(data => setFileSources(data.knowledge_sources))
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
            const agentId = id;
            setIsLoadingTextSources(true);
            getTextSourceList(agentId)
                .then(data => setTextSources(data.knowledge_sources))
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
            const agentId = id;
            setIsLoadingQnaSources(true);
            getQnaSourceList(agentId)
                .then(data => setQnaSources(data.knowledge_sources))
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
                details = await getFileSourceDetails(id, sourceId);
            } else if (type === 'text') {
                details = await getTextSourceDetails(id, sourceId);
            } else if (type === 'qna') {
                details = await getQnaSourceDetails(id, sourceId);
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
            const agentId = id;
            if (activeTab === "files") {
                setIsLoadingFileSources(true);
                getFileSourceList(agentId)
                    .then(data => setFileSources(data.knowledge_sources))
                    .finally(() => setIsLoadingFileSources(false));
            } else if (activeTab === "text") {
                setIsLoadingTextSources(true);
                getTextSourceList(agentId)
                    .then(data => setTextSources(data.knowledge_sources))
                    .finally(() => setIsLoadingTextSources(false));
            } else if (activeTab === "qa") {
                setIsLoadingQnaSources(true);
                getQnaSourceList(agentId)
                    .then(data => setQnaSources(data.knowledge_sources))
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

    return {
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
        isTraining,
        handleSourceClick,
        handleSourceDeleted,
        handleSourceAdded,
        handleBackClick,
        handleTrainAgent,
    };
};
