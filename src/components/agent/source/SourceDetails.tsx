import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    fileSourceDetailsResponse,
    textSourceDetailsResponse,
    qnaSourceDetailsResponse
} from "@/services/source_apis";

type SourceDetails = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse;

interface SourceDetailsProps {
    selectedSource: SourceDetails;
    selectedSourceType: string;
    onBackClick: () => void;
}

const SourceDetails = ({ selectedSource, selectedSourceType, onBackClick }: SourceDetailsProps) => {
    return (
        <div className="flex h-full">
            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="flex-1 p-6">
                    <Button variant="ghost" onClick={onBackClick} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sources
                    </Button>
                    <Card>
                        <CardHeader>
                            <CardTitle>{'title' in selectedSource ? selectedSource.title : "Title Not found"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedSourceType === 'file' && 'content' in selectedSource && <pre className="whitespace-pre-wrap">{selectedSource.content}</pre>}
                            {selectedSourceType === 'text' && 'content' in selectedSource && <pre className="whitespace-pre-wrap">{selectedSource.content}</pre>}
                            {selectedSourceType === 'qna' && 'questions' in selectedSource && (
                                <div>
                                    <h4 className="font-bold">Questions:</h4>
                                    <pre className="whitespace-pre-wrap mb-4">{selectedSource.questions}</pre>
                                    <h4 className="font-bold">Answer:</h4>
                                    <pre className="whitespace-pre-wrap">{selectedSource.answer}</pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border/50 p-6 space-y-6">
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {selectedSource.id}</p>
                    <p><strong>Trained:</strong> <Badge variant={selectedSource.is_trained ? "default" : "secondary"}>{selectedSource.is_trained ? 'Yes' : 'No'}</Badge></p>
                    <p><strong>Created At:</strong> {new Date(selectedSource.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(selectedSource.updated_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default SourceDetails;
