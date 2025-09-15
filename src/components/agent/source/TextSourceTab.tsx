import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, Text } from "lucide-react";
import { textSourceListResponse } from "@/services/source_apis";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TextSourceTabProps {
    textSources: textSourceListResponse[];
    onSourceClick: (id: string, type: string) => void;
}

const TextSourceTab = ({ textSources, onSourceClick }: TextSourceTabProps) => {
    const [isOpen, setIsOpen] = useState(true);

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
                            <Input id="title" placeholder="Enter content title" />
                        </div>
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your text content here..."
                                className="min-h-32"
                            />
                        </div>
                        <div className="text-right">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Text Source
                            </Button>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
                {textSources.map((item) => (
                    <Card key={item.id} className="border-border/50 cursor-pointer" onClick={() => onSourceClick(item.id, 'text')}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Text className="h-5 w-5 text-primary" />
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

export default TextSourceTab;
