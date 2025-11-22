import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ChevronDown, ChevronUp, Trash2, AlertCircle } from "lucide-react";
import { fileSourceListResponse, deleteSource, uploadFileSource } from "@/services/api/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DeleteConfirmation from "./DeleteConfirmation";

interface FileSourceTabProps {
    fileSources: fileSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
    agentId: string;
    onSourceDeleted?: () => void;
    onSourceAdded?: () => void;
}

const FileSourceTab = ({ fileSources, onSourceClick, agentId, onSourceDeleted, onSourceAdded }: FileSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    // Allowed file types
    const allowedFileTypes = [
        'application/pdf',              // PDF files
        'text/plain',                   // Plain text files
        'text/csv',                     // CSV files
        'text/markdown',                // Markdown files
        'text/html',                    // HTML files
        'application/msword',           // Word documents
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word documents
        'application/vnd.ms-excel',     // Excel documents
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel documents
        'application/vnd.ms-powerpoint', // PowerPoint documents
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint documents
    ];

    // File validation function
    const validateFile = (file: File): boolean => {
        if (!allowedFileTypes.includes(file.type)) {
            setFileError(`Invalid file type: ${file.name}. Only PDF, Word, Excel, and text documents are allowed.`);
            return false;
        }
        setFileError(null);
        return true;
    };

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

    const handleChooseFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (!validateFile(file)) return;

        setIsUploading(true);

        try {
            await uploadFileSource(agentId, {
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
            setFileError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!validateFile(file)) return;

        setIsUploading(true);

        try {
            await uploadFileSource(agentId, {
                file: file
            });

            if (onSourceAdded) {
                onSourceAdded();
            }
        } catch (error) {
            console.error('Failed to upload file:', error);
            setFileError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [agentId, onSourceAdded]);

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
                        <div
                            ref={dropzoneRef}
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop files here or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Supported formats: PDF, TXT, MD
                            </p>
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                accept=".pdf,.txt,.doc,.docx,.csv,.md,.html,application/pdf,text/plain,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/html"
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

                        {fileError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{fileError}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {fileSources.map((file) => (
                    <Card key={file.uid} className="border-border/50 cursor-pointer group" onClick={() => onSourceClick(file.uid, 'file')}>
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
                                onClick={(e) => handleDeleteClick(e, file.uid)}
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
