import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { fileSourceListResponse, deleteSource, deleteSourceRequest, uploadFileSource } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DeleteConfirmation from "./DeleteConfirmation";

interface FileSourceTabProps {
    fileSources: fileSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
    agentId: number;
    onSourceDeleted?: () => void;
    onSourceAdded?: () => void;
}

const FileSourceTab = ({ fileSources, onSourceClick, agentId, onSourceDeleted, onSourceAdded }: FileSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const data: deleteSourceRequest = {
        agent_id: agentId,
        source_id: sourceToDelete!,
        type: 'file'
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

    const handleChooseFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setIsUploading(true);

        try {
            await uploadFileSource({
                agent_id: agentId,
                file: file
            });

            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Refresh the file list after successful upload
            if (onSourceAdded) {
                onSourceAdded();
            }
        } catch (error) {
            console.error('Failed to upload file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md border-border/50">
                <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="text-left">
                            <CardTitle className="text-lg text-left">Upload Files</CardTitle>
                            <CardDescription>
                                Upload documents, PDFs, or text files as training sources
                            </CardDescription>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">
                                Drag and drop files here or click to browse
                            </p>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <Button
                                variant="outline"
                                onClick={handleChooseFile}
                                disabled={isUploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isUploading ? 'Uploading...' : 'Choose Files'}
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {fileSources.map((file) => (
                    <Card key={file.id} className="border-border/50 cursor-pointer group" onClick={() => onSourceClick(file.id, 'file')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{file.title}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                                onClick={(e) => handleDeleteClick(e, file.id)}
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
                    title="file source"
                />
            </div>
        </div>
    );
};

export default FileSourceTab;
