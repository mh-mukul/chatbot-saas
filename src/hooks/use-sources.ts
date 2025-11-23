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
    Pagination,
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

    // Pagination states
    const [filePagination, setFilePagination] = useState<Pagination | null>(null);
    const [textPagination, setTextPagination] = useState<Pagination | null>(null);
    const [qnaPagination, setQnaPagination] = useState<Pagination | null>(null);
    const [fileCurrentPage, setFileCurrentPage] = useState(1);
    const [textCurrentPage, setTextCurrentPage] = useState(1);
    const [qnaCurrentPage, setQnaCurrentPage] = useState(1);

    // Loading states
    const [isLoadingFileSources, setIsLoadingFileSources] = useState(false);
    const [isLoadingTextSources, setIsLoadingTextSources] = useState(false);
    const [isLoadingQnaSources, setIsLoadingQnaSources] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);


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
            getFileSourceList(agentId, fileCurrentPage)
                .then(data => {
                    setFileSources(data.knowledge_sources);
                    setFilePagination(data.pagination);
                })
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
    }, [id, activeTab, fileSources.length, fileCurrentPage, toast]);

    // Load text sources only when the "text" tab is active
    useEffect(() => {
        if (id && activeTab === "text" && textSources.length === 0) {
            const agentId = id;
            setIsLoadingTextSources(true);
            getTextSourceList(agentId, textCurrentPage)
                .then(data => {
                    setTextSources(data.knowledge_sources);
                    setTextPagination(data.pagination);
                })
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
    }, [id, activeTab, textSources.length, textCurrentPage, toast]);

    // Load QnA sources only when the "qa" tab is active
    useEffect(() => {
        if (id && activeTab === "qa" && qnaSources.length === 0) {
            const agentId = id;
            setIsLoadingQnaSources(true);
            getQnaSourceList(agentId, qnaCurrentPage)
                .then(data => {
                    setQnaSources(data.knowledge_sources);
                    setQnaPagination(data.pagination);
                })
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
    }, [id, activeTab, qnaSources.length, qnaCurrentPage, toast]);

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
                getFileSourceList(agentId, fileCurrentPage)
                    .then(data => {
                        setFileSources(data.knowledge_sources);
                        setFilePagination(data.pagination);
                    })
                    .finally(() => setIsLoadingFileSources(false));
            } else if (activeTab === "text") {
                setIsLoadingTextSources(true);
                getTextSourceList(agentId, textCurrentPage)
                    .then(data => {
                        setTextSources(data.knowledge_sources);
                        setTextPagination(data.pagination);
                    })
                    .finally(() => setIsLoadingTextSources(false));
            } else if (activeTab === "qa") {
                setIsLoadingQnaSources(true);
                getQnaSourceList(agentId, qnaCurrentPage)
                    .then(data => {
                        setQnaSources(data.knowledge_sources);
                        setQnaPagination(data.pagination);
                    })
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

    // Pagination handlers
    const handleFilePageChange = (page: number) => {
        setFileCurrentPage(page);
        if (id) {
            setIsLoadingFileSources(true);
            getFileSourceList(id, page)
                .then(data => {
                    setFileSources(data.knowledge_sources);
                    setFilePagination(data.pagination);
                })
                .finally(() => setIsLoadingFileSources(false));
        }
    };

    const handleTextPageChange = (page: number) => {
        setTextCurrentPage(page);
        if (id) {
            setIsLoadingTextSources(true);
            getTextSourceList(id, page)
                .then(data => {
                    setTextSources(data.knowledge_sources);
                    setTextPagination(data.pagination);
                })
                .finally(() => setIsLoadingTextSources(false));
        }
    };

    const handleQnaPageChange = (page: number) => {
        setQnaCurrentPage(page);
        if (id) {
            setIsLoadingQnaSources(true);
            getQnaSourceList(id, page)
                .then(data => {
                    setQnaSources(data.knowledge_sources);
                    setQnaPagination(data.pagination);
                })
                .finally(() => setIsLoadingQnaSources(false));
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
        handleSourceClick,
        handleSourceDeleted,
        handleSourceAdded,
        handleBackClick,
        // Pagination
        filePagination,
        textPagination,
        qnaPagination,
        fileCurrentPage,
        textCurrentPage,
        qnaCurrentPage,
        handleFilePageChange,
        handleTextPageChange,
        handleQnaPageChange,
    };
};
