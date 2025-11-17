import { Ellipsis, MessageCirclePlusIcon, History, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeSessionId } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
    title: string;
    chatIcon?: React.ReactNode;
    agentId: string;
    showingHistory: boolean;
    onToggleHistory: () => void;
    onSessionSelect: (sessionId: string) => void;
}

export function ChatHeader({
    title,
    chatIcon,
    agentId,
    showingHistory,
    onToggleHistory,
    onSessionSelect
}: ChatHeaderProps) {
    return (
        <div className="px-4 py-4 border-b flex justify-between items-center relative">
            <div className="flex items-center gap-2">
                {showingHistory ? (
                    <Button variant="ghost" size="icon" onClick={onToggleHistory} className="mr-1">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                ) : null}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground scale-110">
                    {chatIcon}
                </div>
                <h2 className="font-medium">{showingHistory ? "Chat History" : title}</h2>
            </div>
            {!showingHistory && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                removeSessionId();
                                window.location.reload();
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <MessageCirclePlusIcon className="h-4 w-4" />
                            <span>New Chat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onToggleHistory}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <History className="h-4 w-4" />
                            <span>History</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
