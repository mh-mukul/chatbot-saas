import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Plus, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Sources = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [sources] = useState({
    files: 8,
    text: 12,
    qa: 15
  });

  const handleTrainAgent = () => {
    toast({
      title: "Training started",
      description: "Your agent is being trained with the latest sources.",
    });
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Tabs */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-clip-text">
            Knowledge Sources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage training data for your AI agent
          </p>
        </div>

        <Tabs defaultValue="files" className="h-[calc(100vh-180px)]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6 space-y-4">
            <Card className="bg-gradient-card border-border/50">
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
              {[
                { name: "user-manual.pdf", size: "2.4 MB", status: "processed" },
                { name: "faq-document.txt", size: "156 KB", status: "processing" },
                { name: "product-guide.docx", size: "3.1 MB", status: "processed" }
              ].map((file, index) => (
                <Card key={index} className="bg-gradient-card/50 border-border/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Badge variant={file.status === "processed" ? "default" : "secondary"}>
                      {file.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-6 space-y-4">
            <Card className="bg-gradient-card border-border/50">
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
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Text Source
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {[
                { title: "Company Policies", content: "Our comprehensive company policies and procedures...", words: 450 },
                { title: "Product Features", content: "Detailed overview of all product features and capabilities...", words: 320 }
              ].map((item, index) => (
                <Card key={index} className="bg-gradient-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.words} words
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="mt-6 space-y-4">
            <Card className="bg-gradient-card border-border/50">
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
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Q&A Pair
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {[
                { title: "Account Setup", question: "How do I create an account?", answer: "To create an account, click on the sign-up button..." },
                { title: "Password Reset", question: "I forgot my password", answer: "You can reset your password by clicking the forgot password link..." }
              ].map((item, index) => (
                <Card key={index} className="bg-gradient-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2">{item.title}</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Question:</p>
                        <p className="text-xs">{item.question}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Answer:</p>
                        <p className="text-xs line-clamp-2">{item.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Summary & Actions */}
      <div className="w-80 border-l border-border/50 bg-gradient-card/30 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Training Summary
          </h2>
          
          <div className="space-y-4">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sources.files}</div>
                  <div className="text-sm text-muted-foreground">Files</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sources.text}</div>
                  <div className="text-sm text-muted-foreground">Text Sources</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sources.qa}</div>
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