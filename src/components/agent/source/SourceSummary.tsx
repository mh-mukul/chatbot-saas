import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { MessageCircleQuestion, Text, FileText } from "lucide-react";

interface SourceSummaryProps {
    fileStatus: {
        failed: number;
        pending: number;
        processed: number;
        processing: number;
    };
    textStatus: {
        pending: number;
        processing: number;
    };
    qnaStatus: {
        pending: number;
        processing: number;
    };
}

const SourceSummary = ({ fileStatus, textStatus, qnaStatus }: SourceSummaryProps) => {
    const formatStatus = (status: { processed?: number; processing: number; pending: number; failed?: number }) => {
        const parts: string[] = [];
        if (status.processed !== undefined && status.processed > 0) {
            parts.push(`${status.processed} processed`);
        }
        if (status.processing > 0) {
            parts.push(`${status.processing} processing`);
        }
        if (status.pending > 0) {
            parts.push(`${status.pending} pending`);
        }
        if (status.failed !== undefined && status.failed > 0) {
            parts.push(`${status.failed} failed`);
        }
        return parts.length > 0 ? parts.join(", ") : "None";
    };

    const getTotalCount = (status: { processed?: number; processing: number; pending: number; failed?: number }) => {
        return (status.processed || 0) + status.processing + status.pending + (status.failed || 0);
    };

    return (
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border/50 p-6 space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Training Sources
                </h2>
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm mb-1">
                                        {getTotalCount(fileStatus)} Files
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatStatus(fileStatus)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Text className="h-5 w-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm mb-1">
                                        {getTotalCount(textStatus)} Text Sources
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatStatus(textStatus)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <MessageCircleQuestion className="h-5 w-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm mb-1">
                                        {getTotalCount(qnaStatus)} Q&A Pairs
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatStatus(qnaStatus)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SourceSummary;
