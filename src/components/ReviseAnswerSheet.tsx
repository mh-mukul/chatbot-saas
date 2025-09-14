import React from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { sessionMessagesResponse } from "@/services/chat_apis";
import { CheckCircle } from "lucide-react";

interface ReviseAnswerSheetProps {
    message: sessionMessagesResponse;
    children: React.ReactNode;
}

export function ReviseAnswerSheet({ message, children }: ReviseAnswerSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="sm:max-w-[450px]">
                <SheetHeader>
                    <SheetTitle>Revise Answer</SheetTitle>
                    <SheetDescription>
                        Update the agent's response to improve its accuracy.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
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
                        />
                    </div>
                </div>
                <div className="flex justify-between gap-2 pt-4">
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </SheetClose>
                    <Button className="w-full">Update Answer</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export const RevisedButton = () => (
    <Button variant="outline" size="sm" className="mt-2 hover:bg-green">
        <CheckCircle className="h-4 w-4 mr-2" />
        Revised
    </Button>
);

export const ReviseButton = React.forwardRef<
    HTMLButtonElement,
    { children: React.ReactNode }
>(({ children, ...props }, ref) => (
    <Button
        variant="outline"
        size="sm"
        ref={ref}
        {...props}
        className="hover:bg-green"
    >
        {children}
    </Button>
));

ReviseButton.displayName = "ReviseButton";
