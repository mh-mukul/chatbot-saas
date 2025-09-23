import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { getUserSessionList, sessionListResponse } from "@/services/api/chat_apis";

interface SessionListProps {
    agentId: string;
    userId: string;
    onSelectSession: (sessionId: string) => void;
}

export function SessionList({ agentId, userId, onSelectSession }: SessionListProps) {
    const [sessions, setSessions] = useState<sessionListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user sessions
    useEffect(() => {
        const fetchSessions = async () => {
            if (!agentId || !userId) {
                setError("Agent ID or User ID is missing");
                setLoading(false);
                return;
            }

            try {
                const sessionList = await getUserSessionList(Number(agentId), userId);
                setSessions(sessionList);
            } catch (err) {
                console.error("Error fetching sessions:", err);
                setError("Failed to load session history");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [agentId, userId]);

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
        </div>;
    }

    if (error) {
        return <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-destructive">{error}</p>
        </div>;
    }

    if (sessions.length === 0) {
        return <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No chat history found</p>
        </div>;
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-2">
                {sessions.map((session) => (
                    <div
                        key={session.session_id}
                        className="p-3 cursor-pointer hover:bg-muted/30 transition-colors border-b rounded-md mb-2"
                        onClick={() => onSelectSession(session.session_id)}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                            <p className="text-sm font-medium line-clamp-1">{session.input || "New Chat"}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                        </p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}