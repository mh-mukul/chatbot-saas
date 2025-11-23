import { getSessionList, getSessionMessages, sessionListResponse, sessionMessagesResponse } from "@/services/api/activity_apis";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Bot, CheckCircle, Filter, RefreshCw, Ellipsis, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { ReviseAnswerSheet, ReviseButton } from "@/components/ReviseAnswerSheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';

type Message = {
  role: "user" | "assistant";
  content: string;
  created_at: Date;
  revised?: boolean;
  rawMessage?: sessionMessagesResponse;
};

const ActivityPage = () => {
  const { id } = useParams();

  const [chatSessions, setChatSessions] = useState<sessionListResponse[]>([]);
  const [selectedSession, setSelectedSession] = useState<sessionListResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const fetchSessions = async () => {
    if (id) {
      setIsLoadingSessions(true);
      try {
        const response = await getSessionList(id);
        // Ensure sessions is always an array
        const sessionsArray = Array.isArray(response.sessions) ? response.sessions : [];
        setChatSessions(sessionsArray);
        if (sessionsArray.length > 0) {
          setSelectedSession(sessionsArray[0]);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        // Set empty array on error
        setChatSessions([]);
      } finally {
        setIsLoadingSessions(false);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedSession) {
        setIsLoadingMessages(true);
        try {
          const sessionMessages = await getSessionMessages(id!, selectedSession.uid);
          // Ensure sessionMessages is always an array
          const messagesArray = Array.isArray(sessionMessages) ? sessionMessages : [];
          const formattedMessages: Message[] = messagesArray.flatMap((msg) => [
            { role: "user" as const, content: msg.human_message, created_at: new Date(msg.date_time) },
            {
              role: "assistant" as const,
              content: msg.ai_message,
              created_at: new Date(msg.date_time),
              revised: msg.revised,
              rawMessage: msg
            },
          ]);
          setMessages(formattedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          // Set empty array on error
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      } else {
        // Clear messages when no session is selected
        setMessages([]);
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
            <Button
              variant="outline"
              onClick={fetchSessions}
              disabled={isLoadingSessions}
            >
              {isLoadingSessions ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-3">
            {isLoadingSessions ? (
              // Loading skeletons for sessions
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-1">
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ))
            ) : chatSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg mb-2">No Chat Sessions Yet</h3>
                <p className="text-sm text-muted-foreground">
                  There are no chat sessions available for this agent.
                </p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <Card
                  key={session.uid}
                  className={`cursor-pointer transition-all ${selectedSession?.uid === session.uid
                    ? "border-primary"
                    : "border-border/50 hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">
                        {
                          session.uid && session.uid.trim().length > 20
                            ? session.uid.trim().slice(0, 20) + "..."
                            : session.uid?.trim()
                        }
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.date_time), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {session.human_message && session.human_message.trim().length > 25
                          ? session.human_message.trim().slice(0, 25) + "..."
                          : session.human_message?.trim()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-border/50 justify-between flex items-center">
          <p className="text-muted-foreground mt-1">
            {selectedSession && selectedSession.uid ? selectedSession.uid : "No session selected"}
          </p>
          {selectedSession && (
            <Button variant="outline">
              <Ellipsis className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="p-3 h-[calc(100vh-180px)]">
          {!selectedSession ? (
            <div className="flex flex-col items-center justify-center text-center h-full p-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">No Session Selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select a chat session from the left panel to view messages.
              </p>
            </div>
          ) : isLoadingMessages ? (
            // Loading skeleton for messages
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`flex gap-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${index % 2 === 0 ? "flex-row-reverse" : "flex-row"}`}>
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <Card className="w-full border-0 shadow-none">
                      <div className="flex-1 p-6">
                        <div className="flex gap-3 justify-start mb-4">
                          <Card className="border-border/50">
                            <CardContent className="p-3">
                              <Skeleton className="h-4 w-72" />
                              <Skeleton className="h-4 w-40 mt-2" />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full p-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">No Messages</h3>
              <p className="text-sm text-muted-foreground">
                This chat session doesn't contain any messages.
              </p>
            </div>
          ) : (
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
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.role === "user"
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
                      <div className="relative inline-block w-full">
                        <CardContent className={`p-3 rounded-lg ${message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                          }`}>
                          <div className="text-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 flex justify-end">
                            {formatDistanceToNow(message.created_at, { addSuffix: true })}
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
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ActivityPage;