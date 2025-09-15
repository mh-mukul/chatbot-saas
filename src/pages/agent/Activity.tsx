import { getSessionList, getSessionMessages, sessionListResponse, sessionMessagesResponse } from "@/services/chat_apis";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Bot, CheckCircle, Filter, RefreshCw, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { ReviseAnswerSheet, ReviseButton } from "@/components/ReviseAnswerSheet";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
  created_at: string;
  revised?: boolean;
  rawMessage?: sessionMessagesResponse;
};

const ActivityPage = () => {
  const { id } = useParams();

  const [chatSessions, setChatSessions] = useState<sessionListResponse[]>([]);
  const [selectedSession, setSelectedSession] = useState<sessionListResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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

  useEffect(() => {
    fetchSessions();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedSession) {
        try {
          const sessionMessages = await getSessionMessages(selectedSession.session_id);
          const formattedMessages: Message[] = sessionMessages.flatMap((msg) => [
            { role: "user" as const, content: msg.input, created_at: new Date(msg.created_at).toLocaleTimeString() },
            {
              role: "assistant" as const,
              content: msg.output,
              created_at: new Date(msg.created_at).toLocaleTimeString(),
              revised: msg.revised,
              rawMessage: msg
            },
          ]);
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedSession]);

  const handleRevisionSuccess = (chatId: number) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.rawMessage && msg.rawMessage.id === chatId) {
          return {
            ...msg,
            revised: true,
            rawMessage: { ...msg.rawMessage, revised: true }
          };
        }
        return msg;
      })
    );
  };

  if (!id) {
    return <div>Invalid agent ID</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Chat Sessions */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            Chat Sessions
          </h2>
          <div>
            <Button variant="outline" onClick={fetchSessions}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
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
                      {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
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
        <div className="p-3 border-b border-border/50 justify-between flex items-center">
          <p className="text-muted-foreground mt-1">
            {selectedSession?.session_id}
          </p>
          <Button variant="outline">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="p-3 h-[calc(100vh-180px)]">
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
                  <Card className="w-full border-0 shadow-none">
                    <div className="relative inline-block">
                      <CardContent className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex justify-end">
                          {message.created_at}
                        </p>
                      </CardContent>

                      {/* Floating button */}
                      {message.role === "assistant" && (
                        <div className="absolute -bottom-4 left-4 flex items-center">
                          {
                            message.rawMessage && (
                              <ReviseAnswerSheet
                                message={message.rawMessage}
                                agentId={Number(id)}
                                onSuccess={handleRevisionSuccess}
                              >
                                <ReviseButton>
                                  {message.revised ? <><CheckCircle className="h-4 w-4" />Revised</> : "Revise Answer"}
                                </ReviseButton>
                              </ReviseAnswerSheet>
                            )
                          }
                        </div>
                      )}
                    </div>
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