import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, Text, Trash2 } from "lucide-react";
import { textSourceListResponse, deleteSource, createTextSource, createTextSourceRequest, Pagination } from "@/services/api/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DeleteConfirmation from "./DeleteConfirmation";
import PaginationControls from "./PaginationControls";

interface TextSourceTabProps {
    textSources: textSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
    agentId: string;
    onSourceDeleted?: () => void;
    onSourceAdded?: () => void;
    pagination: Pagination | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const TextSourceTab = ({ textSources, onSourceClick, agentId, onSourceDeleted, onSourceAdded, pagination, currentPage, onPageChange }: TextSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card click event
        setSourceToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (sourceToDelete) {
            try {
                await deleteSource(agentId, sourceToDelete);
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
            title,
            content
        };

        try {
            await createTextSource(agentId, textSourceData);

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

    // Helper function to get status badge variant
    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status.toLowerCase()) {
            case "processed":
                return "default";
            case "processing":
                return "secondary";
            case "failed":
                return "destructive";
            default:
                return "outline";
        }
    };

    // Helper function to format date
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                {textSources.map((item) => {
                    const isProcessed = item.status.toLowerCase() === 'processed';
                    return (
                        <Card
                            key={item.uid}
                            className={`border-border/50 group ${isProcessed ? 'cursor-pointer hover:border-primary/50' : 'opacity-60 cursor-not-allowed'
                                }`}
                            onClick={() => isProcessed && onSourceClick(item.uid, 'text')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <Text className={`h-5 w-5 mt-0.5 ${isProcessed ? 'text-primary' : 'text-muted-foreground'
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={`font-medium text-sm truncate ${!isProcessed && 'text-muted-foreground'
                                                    }`}>
                                                    {item.title}
                                                </h3>
                                                <Badge variant={getStatusBadgeVariant(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                                        onClick={(e) => handleDeleteClick(e, item.uid)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                <PaginationControls
                    pagination={pagination}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />

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
