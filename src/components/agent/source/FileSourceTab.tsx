import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { fileSourceListResponse } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FileSourceTabProps {
    fileSources: fileSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
}

const FileSourceTab = ({ fileSources, onSourceClick }: FileSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);

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
                            <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Files
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {fileSources.map((file) => (
                    <Card key={file.id} className="border-border/50 cursor-pointer" onClick={() => onSourceClick(file.id, 'file')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{file.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FileSourceTab;
