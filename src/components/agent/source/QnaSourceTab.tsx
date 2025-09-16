import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, TableOfContents, MessageCircleQuestion } from "lucide-react";
import { qnaSourceListResponse } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QnaSourceTabProps {
    qnaSources: qnaSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
}

const QnaSourceTab = ({ qnaSources, onSourceClick }: QnaSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);

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
                            <Input id="qa-title" placeholder="Enter Q&A title" />
                        </div>
                        <div>
                            <Label htmlFor="question">Question(s)</Label>
                            <Textarea
                                id="question"
                                placeholder="Enter questions (one per line)"
                                className="min-h-24"
                            />
                        </div>
                        <div>
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea
                                id="answer"
                                placeholder="Enter the answer"
                                className="min-h-24"
                            />
                        </div>
                        <div className="text-right">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Q&A Pair
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {qnaSources.map((item) => (
                    <Card key={item.id} className="border-border/50 cursor-pointer" onClick={() => onSourceClick(item.id, 'qna')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageCircleQuestion className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm">{item.title}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default QnaSourceTab;
