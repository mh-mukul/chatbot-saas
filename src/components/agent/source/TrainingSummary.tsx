import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface TrainingSummaryProps {
    fileSources: number;
    textSources: number;
    qnaSources: number;
    onTrainAgent: () => void;
}

const TrainingSummary = ({ fileSources, textSources, qnaSources, onTrainAgent }: TrainingSummaryProps) => {
    return (
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
                                <div className="text-2xl font-bold text-primary">{fileSources}</div>
                                <div className="text-sm text-muted-foreground">Files</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{textSources}</div>
                                <div className="text-sm text-muted-foreground">Text Sources</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{qnaSources}</div>
                                <div className="text-sm text-muted-foreground">Q&A Pairs</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Button
                onClick={onTrainAgent}
                className="w-full transition-spring"
                size="lg"
            >
                <Brain className="h-4 w-4 mr-2" />
                Train Agent
            </Button>
        </div>
    );
};

export default TrainingSummary;
