import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Plus, Brain, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getFileSourceList,
  getTextSourceList,
  getQnaSourceList,
  fileSourceListResponse,
  textSourceListResponse,
  qnaSourceListResponse,
  getFileSourceDetails,
  getTextSourceDetails,
  getQnaSourceDetails,
  fileSourceDetailsResponse,
  textSourceDetailsResponse,
  qnaSourceDetailsResponse,
} from "@/services/source_apis";
import { ScrollArea } from "@/components/ui/scroll-area";

type SourceDetails = fileSourceDetailsResponse | textSourceDetailsResponse | qnaSourceDetailsResponse | null;

const Sources = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [fileSources, setFileSources] = useState<fileSourceListResponse[]>([]);
  const [textSources, setTextSources] = useState<textSourceListResponse[]>([]);
  const [qnaSources, setQnaSources] = useState<qnaSourceListResponse[]>([]);

  const [selectedSource, setSelectedSource] = useState<SourceDetails>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const agentId = parseInt(id, 10);
      getFileSourceList(agentId).then(setFileSources);
      getTextSourceList(agentId).then(setTextSources);
      getQnaSourceList(agentId).then(setQnaSources);
    }
  }, [id]);

  const handleSourceClick = async (sourceId: string, type: string) => {
    setSelectedSourceType(type);
    try {
      let details: SourceDetails = null;
      if (type === 'file') {
        details = await getFileSourceDetails(sourceId);
      } else if (type === 'text') {
        details = await getTextSourceDetails(sourceId);
      } else if (type === 'qna') {
        details = await getQnaSourceDetails(sourceId);
      }
      setSelectedSource(details);
    } catch (error) {
      console.error("Error fetching source details:", error);
      toast({
        title: "Error",
        description: "Could not fetch source details.",
        variant: "destructive",
      });
    }
  };

  const handleBackClick = () => {
    setSelectedSource(null);
    setSelectedSourceType(null);
  };

  const handleTrainAgent = () => {
    toast({
      title: "Training started",
      description: "Your agent is being trained with the latest sources.",
    });
  };

  if (selectedSource && selectedSourceType) {
    return (
      <div className="flex h-full">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="flex-1 p-6">
            <Button variant="ghost" onClick={handleBackClick} className="mb-4">
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
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Tabs */}
      <div className="flex-1 p-6">
        {/* <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            Knowledge Sources
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage training data for your AI agent
          </p>
        </div> */}

        <Tabs defaultValue="files" className="h-[calc(100vh-180px)]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6 space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Upload Files</CardTitle>
                <CardDescription>
                  Upload documents, PDFs, or text files as training sources
                </CardDescription>
              </CardHeader>
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
            </Card>

            <div className="space-y-3">
              {fileSources.map((file) => (
                <Card key={file.id} className="border-border/50 cursor-pointer" onClick={() => handleSourceClick(file.id, 'file')}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-6 space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Add Text Content</CardTitle>
                <CardDescription>
                  Add custom text content as training material
                </CardDescription>
              </CardHeader>
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
            </Card>

            <div className="space-y-3">
              {textSources.map((item) => (
                <Card key={item.id} className="border-border/50 cursor-pointer" onClick={() => handleSourceClick(item.id, 'text')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-6 space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Add Q&A Pair</CardTitle>
                <CardDescription>
                  Create question and answer pairs for training
                </CardDescription>
              </CardHeader>
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
            </Card>

            <div className="space-y-3">
              {qnaSources.map((item) => (
                <Card key={item.id} className="border-border/50 cursor-pointer" onClick={() => handleSourceClick(item.id, 'qna')}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2">{item.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Summary & Actions */}
      <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border/50 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Training Summary
          </h2>

          <div className="space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{fileSources.length}</div>
                  <div className="text-sm text-muted-foreground">Files</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{textSources.length}</div>
                  <div className="text-sm text-muted-foreground">Text Sources</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{qnaSources.length}</div>
                  <div className="text-sm text-muted-foreground">Q&A Pairs</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button
          onClick={handleTrainAgent}
          className="w-full transition-spring"
          size="lg"
        >
          <Brain className="h-4 w-4 mr-2" />
          Train Agent
        </Button>
      </div>
    </div>
  );
};

export default Sources;