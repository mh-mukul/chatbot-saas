import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { getRevisedAnswer, reviseAnswer, sessionMessagesResponse } from "@/services/api/chat_apis";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ReviseAnswerSheetProps {
    agentId: number;
    message: sessionMessagesResponse;
    children: React.ReactNode;
    onSuccess: (chatId: number) => void;
}

export function ReviseAnswerSheet({ agentId, message, children, onSuccess }: ReviseAnswerSheetProps) {
    const [revisedAnswerText, setRevisedAnswerText] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRevisedAnswer = async () => {
            if (isOpen && message.revised) {
                try {
                    const response = await getRevisedAnswer(message.id);
                    console.log(response);
                    if (response && response.answer) {
                        setRevisedAnswerText(response.answer);
                    }
                } catch (error) {
                    console.error("Failed to fetch revised answer:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to fetch the revised answer.",
                    });
                }
            }
        };

        fetchRevisedAnswer();
    }, [isOpen, message.revised, message.id, toast]);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await reviseAnswer({
                agent_id: agentId,
                chat_id: String(message.id),
                revised_answer: revisedAnswerText,
            });
            toast({
                title: "Success",
                description: "The answer has been revised successfully.",
            });
            onSuccess(message.id);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to revise answer:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to revise the answer. Please try again.",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild onClick={() => setIsOpen(true)}>
                {children}
            </SheetTrigger>
            <SheetContent className="sm:max-w-[450px]">
                <SheetHeader>
                    <SheetTitle>Revise Answer</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="grid gap-4 p-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="user-message">User Message</Label>
                            <Textarea
                                id="user-message"
                                value={message.input}
                                disabled
                                className="h-24"
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="agent-response">Agent Response</Label>
                            <Textarea
                                id="agent-response"
                                value={message.output}
                                disabled
                                className="h-48"
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="expected-response">Expected Response</Label>
                            <Textarea
                                id="expected-response"
                                placeholder="Enter the expected response from the agent."
                                className="h-48"
                                value={revisedAnswerText}
                                onChange={(e) => setRevisedAnswerText(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between gap-2 pt-4">
                            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button className="w-full" onClick={handleUpdate} disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Answer
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export const ReviseButton = React.forwardRef<
    HTMLButtonElement,
    { children: React.ReactNode }
>(({ children, ...props }, ref) => (
    <Button
        // variant="outline"
        size="sm"
        ref={ref}
        {...props}
        className="h-6 px-2 rounded-md text-sm"
    >
        {children}
    </Button>
));

ReviseButton.displayName = "ReviseButton";
