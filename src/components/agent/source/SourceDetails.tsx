import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    fileSourceDetailsResponse,
    textSourceDetailsResponse,
    qnaSourceDetailsResponse
} from "@/services/api/source_apis";

type SourceDetails = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse;

interface SourceDetailsProps {
    selectedSource: SourceDetails;
    selectedSourceType: string;
    onBackClick: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "processed": return "bg-green-500/20 text-green-400 border-green-500/50";
        case "processing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        case "failed": return "bg-red-500/20 text-red-400 border-red-500/50";
        case "pending": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
        default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
};

const SourceDetails = ({ selectedSource, selectedSourceType, onBackClick }: SourceDetailsProps) => {
    return (
        <div className="flex h-full">
            <div className="flex-1 p-6">
                <Button variant="ghost" onClick={onBackClick} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sources
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>{'title' in selectedSource ? selectedSource.title : "Title Not found"}</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        <CardContent>
                            {selectedSourceType === 'file' && 'content' in selectedSource && <pre className="whitespace-pre-wrap">{selectedSource.content}</pre>}
                            {selectedSourceType === 'text' && 'content' in selectedSource && <pre className="whitespace-pre-wrap">{selectedSource.content}</pre>}
                            {selectedSourceType === 'qna' && 'questions' in selectedSource && (
                                <div>
                                    <h4 className="font-bold">Questions:</h4>
                                    <pre className="whitespace-pre-wrap mb-4">{selectedSource.questions.join('\n')}</pre>
                                    <h4 className="font-bold">Answer:</h4>
                                    <pre className="whitespace-pre-wrap">{selectedSource.answer}</pre>
                                </div>
                            )}
                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/50 p-6 space-y-6">
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {selectedSource.uid}</p>
                    <div><strong>Status:</strong>
                        <Badge className={getStatusColor(String(selectedSource.status))}>
                            {selectedSource.status}
                        </Badge>
                    </div>
                    <p><strong>Created At:</strong> {new Date(selectedSource.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(selectedSource.updated_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default SourceDetails;
