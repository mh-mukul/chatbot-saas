import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, MessageCircleQuestion, Trash2 } from "lucide-react";
import { qnaSourceListResponse, deleteSource, deleteSourceRequest, createQnaSource, createQnaSourceRequest } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DeleteConfirmation from "./DeleteConfirmation";

interface QnaSourceTabProps {
    qnaSources: qnaSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
    agentId: number;
    onSourceDeleted?: () => void;
    onSourceAdded?: () => void;
}

const QnaSourceTab = ({ qnaSources, onSourceClick, agentId, onSourceDeleted, onSourceAdded }: QnaSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState("");
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const data: deleteSourceRequest = {
        agent_id: agentId,
        source_id: sourceToDelete!,
        type: 'qna'
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card click event
        setSourceToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (sourceToDelete) {
            try {
                await deleteSource(data);
                setDeleteDialogOpen(false);
                setSourceToDelete(null);
                if (onSourceDeleted) {
                    onSourceDeleted();
                }
            } catch (error) {
                console.error('Failed to delete source:', error);
                // You could add error handling UI here
            }
        }
    };

    const handleAddQnaPair = async () => {
        if (!title || !questions || !answer) return;

        setIsSubmitting(true);

        const qnaSourceData: createQnaSourceRequest = {
            agent_id: agentId,
            type: 'qna',
            title,
            questions,
            answer
        };

        try {
            await createQnaSource(qnaSourceData);

            // Reset form fields
            setTitle("");
            setQuestions("");
            setAnswer("");

            // Refresh the source list
            if (onSourceAdded) {
                onSourceAdded();
            }
        } catch (error) {
            console.error('Failed to create QnA source:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md border-border/50">
                <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="text-left">
                            <CardTitle className="text-lg text-left">Add Q&A Pair</CardTitle>
                            <CardDescription>
                                Create question and answer pairs for training
                            </CardDescription>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="qa-title">Title</Label>
                            <Input
                                id="qa-title"
                                placeholder="Enter Q&A title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="question">Question(s)</Label>
                            <Textarea
                                id="question"
                                placeholder="Enter questions (one per line)"
                                className="min-h-24"
                                value={questions}
                                onChange={(e) => setQuestions(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea
                                id="answer"
                                placeholder="Enter the answer"
                                className="min-h-24"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>
                        <div className="text-right">
                            <Button
                                onClick={handleAddQnaPair}
                                disabled={isSubmitting || !title || !questions || !answer}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isSubmitting ? "Adding..." : "Add Q&A Pair"}
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {qnaSources.map((item) => (
                    <Card key={item.id} className="border-border/50 cursor-pointer group" onClick={() => onSourceClick(item.id, 'qna')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageCircleQuestion className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm">{item.title}</h3>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                                onClick={(e) => handleDeleteClick(e, item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                <DeleteConfirmation
                    isOpen={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Q&A source"
                />
            </div>
        </div>
    );
};

export default QnaSourceTab;
