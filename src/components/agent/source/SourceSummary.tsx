import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MessageCircleQuestion, Text, FileText, Loader2 } from "lucide-react";

interface SourceSummaryProps {
    fileSources: number;
    textSources: number;
    qnaSources: number;
    trainingRequired: boolean;
    isTraining: boolean;
    onTrainAgent: () => void;
}

const SourceSummary = ({ fileSources, textSources, qnaSources, trainingRequired, isTraining, onTrainAgent }: SourceSummaryProps) => {
    return (
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border/50 p-6 space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Training Sources
                </h2>
                <div className="space-y-4">
                    <Card className="border-border/50">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{fileSources} Files</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                            <Text className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{textSources} Text Sources</h3>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                            <MessageCircleQuestion className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{qnaSources} Q&A Pairs</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Button
                onClick={onTrainAgent}
                className="w-full transition-spring"
                size="lg"
                disabled={(fileSources === 0 && textSources === 0 && qnaSources === 0) || isTraining}
            >
                {isTraining ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Training...
                    </>
                ) : (
                    "Train Agent"
                )}
            </Button>

            {trainingRequired && !isTraining && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Training is required for changes to apply
                    </AlertDescription>
                </Alert>
            )}

            {isTraining && (
                <Alert className="mb-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                        Training in progress...
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default SourceSummary;
