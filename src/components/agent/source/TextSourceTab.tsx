import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, Text, Trash2 } from "lucide-react";
import { textSourceListResponse, deleteSource, deleteSourceRequest, createTextSource, createTextSourceRequest } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DeleteConfirmation from "./DeleteConfirmation";

interface TextSourceTabProps {
    textSources: textSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
    agentId: number;
    onSourceDeleted?: () => void;
    onSourceAdded?: () => void;
}

const TextSourceTab = ({ textSources, onSourceClick, agentId, onSourceDeleted, onSourceAdded }: TextSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const data: deleteSourceRequest = {
        agent_id: agentId,
        source_id: sourceToDelete!,
        type: 'text'
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

    const handleAddTextSource = async () => {
        if (!title || !content) return;

        setIsSubmitting(true);

        const textSourceData: createTextSourceRequest = {
            agent_id: agentId,
            type: 'text',
            title,
            content
        };

        try {
            await createTextSource(textSourceData);

            // Reset form fields
            setTitle("");
            setContent("");

            // Refresh the source list
            if (onSourceAdded) {
                onSourceAdded();
            }
        } catch (error) {
            console.error('Failed to create text source:', error);
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
                            <CardTitle className="text-lg text-left">Add Text Content</CardTitle>
                            <CardDescription>
                                Add custom text content as training material
                            </CardDescription>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter content title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your text content here..."
                                className="min-h-32"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="text-right">
                            <Button
                                onClick={handleAddTextSource}
                                disabled={isSubmitting || !title || !content}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isSubmitting ? "Adding..." : "Add Text Source"}
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {textSources.map((item) => (
                    <Card key={item.id} className="border-border/50 cursor-pointer group" onClick={() => onSourceClick(item.id, 'text')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Text className="h-5 w-5 text-primary" />
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
                    title="text source"
                />
            </div>
        </div>
    );
};

export default TextSourceTab;
