import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Clock, User, Bot } from "lucide-react";

const ActivityPage = () => {
  const { id } = useParams();

  const chatSessions = [
    { id: "1", session_id: "abcdefgh", messages: 5, input: "Hi, can anyone help me?", timestamp: "2 minutes ago" },
    { id: "2", session_id: "qwertyui", messages: 8, input: "I want refund", timestamp: "15 minutes ago" },
    { id: "3", session_id: "mnbvcxza", messages: 4, input: "How can I upgrade to premium?", timestamp: "1 hour ago" },
    { id: "4", session_id: "lkjhgfda", messages: 2, input: "Can I invite new members?", timestamp: "2 hours ago" }
  ];

  const [selectedSession, setSelectedSession] = useState(chatSessions[0]);

  const messages = [
    { role: "user", content: "Hi, I need help with my account", timestamp: "14:32" },
    { role: "assistant", content: "Hello! I'd be happy to help you with your account. What specific issue are you experiencing?", timestamp: "14:32" },
    { role: "user", content: "I can't log in to my dashboard", timestamp: "14:33" },
    { role: "assistant", content: "I understand you're having trouble logging in. Let me help you troubleshoot this issue.", timestamp: "14:33" }
  ];

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
                className={`cursor-pointer transition-all ${selectedSession.id === session.id
                  ? "border-primary"
                  : "border-border/50 hover:border-primary/50"
                  }`}
                onClick={() => setSelectedSession(session)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{session.session_id}</h3>
                    <span className="text-xs text-muted-foreground">
                      {session.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {session.messages} messages
                    </span>
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
            {selectedSession.session_id}
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
                        {message.timestamp}
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