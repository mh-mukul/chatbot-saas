import { getSessionList, getSessionMessages, sessionListResponse } from "@/services/chat_apis";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { add, formatDistanceToNow } from 'date-fns';

const ActivityPage = () => {
  const { id } = useParams();

  const [chatSessions, setChatSessions] = useState<sessionListResponse[]>([]);
  const [selectedSession, setSelectedSession] = useState<sessionListResponse | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; created_at: string }[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (id) {
        try {
          const sessions = await getSessionList(Number(id));
          setChatSessions(sessions);
          if (sessions.length > 0) {
            setSelectedSession(sessions[0]);
          }
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        }
      }
    };
    fetchSessions();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedSession) {
        try {
          const sessionMessages = await getSessionMessages(selectedSession.session_id);
          const formattedMessages = sessionMessages.flatMap((msg) => [
            { role: "user" as const, content: msg.input, created_at: new Date(msg.created_at).toLocaleTimeString() },
            { role: "assistant" as const, content: msg.output, created_at: new Date(msg.created_at).toLocaleTimeString() },
          ]);
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedSession]);

  if (!id) {
    return <div>Invalid agent ID</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Chat Sessions */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            Chat Sessions
          </h2>
          <p className="text-sm text-muted-foreground">
            Recent conversations and activity logs
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {chatSessions.map((session) => (
              <Card
                key={session.id}
                className={`cursor-pointer transition-all ${selectedSession?.id === session.id
                  ? "border-primary"
                  : "border-border/50 hover:border-primary/50"
                  }`}
                onClick={() => setSelectedSession(session)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">
                      {
                        session.session_id && session.session_id.trim().length > 20
                          ? session.session_id.trim().slice(0, 20) + "..."
                          : session.session_id?.trim()
                      }
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.created_at), {addSuffix: true})}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.input && session.input.trim().length > 25
                        ? session.input.trim().slice(0, 25) + "..."
                        : session.input?.trim()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-border/50 bg-gradient-card/20">
          <p className="text-muted-foreground mt-1">
            {selectedSession?.session_id}
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                      }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <Card
                    className={`${message.role === "user"
                      ? "bg-muted"
                      : "border-border/50"
                      }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.created_at}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ActivityPage;