import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSessionId } from "@/lib/utils";

interface ChatHeaderProps {
    title: string;
    chatIcon?: React.ReactNode;
}

export function ChatHeader({ title, chatIcon }: ChatHeaderProps) {
    return (
        <div className="px-4 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground scale-110">
                    {chatIcon}
                </div>
                <h2 className="font-medium">{title}</h2>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    clearSessionId();
                    window.location.reload();
                }}
            >
                <RefreshCcw className="h-4 w-4" />
            </Button>
        </div>
    );
}
