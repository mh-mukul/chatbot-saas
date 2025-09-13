import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, MessageSquare, Clock, User } from "lucide-react";

const ActivityPage = () => {
  const { id } = useParams();
  
  const chatSessions = [
    { id: "1", user: "User #1247", messages: 12, duration: "5m 32s", timestamp: "2 minutes ago" },
    { id: "2", user: "User #1246", messages: 8, duration: "3m 18s", timestamp: "15 minutes ago" },
    { id: "3", user: "User #1245", messages: 15, duration: "8m 45s", timestamp: "1 hour ago" },
    { id: "4", user: "User #1244", messages: 6, duration: "2m 12s", timestamp: "2 hours ago" }
  ];

  const [selectedSession, setSelectedSession] = useState(chatSessions[0]);

  const messages = [
    { role: "user", content: "Hi, I need help with my account", timestamp: "14:32" },
    { role: "assistant", content: "Hello! I'd be happy to help you with your account. What specific issue are you experiencing?", timestamp: "14:32" },
    { role: "user", content: "I can't log in to my dashboard", timestamp: "14:33" },
    { role: "assistant", content: "I understand you're having trouble logging in. Let me help you troubleshoot this issue.", timestamp: "14:33" }
  ];

  return (
    <div className="flex h-full">
      {/* Left Panel - Chat Sessions */}
      <div className="w-80 border-r border-border/50 bg-gradient-card/30 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
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
                className={`cursor-pointer transition-all ${
                  selectedSession.id === session.id
                    ? "bg-gradient-primary/20 border-primary"
                    : "bg-gradient-card border-border/50 hover:border-primary/50"
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{session.user}</h3>
                    <span className="text-xs text-muted-foreground">
                      {session.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messages} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.duration}
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
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Activity Log
          </h1>
          <p className="text-muted-foreground mt-1">
            Viewing conversation with {selectedSession.user}
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-muted text-muted-foreground"
                        : "bg-gradient-primary text-primary-foreground"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <Card
                    className={`${
                      message.role === "user"
                        ? "bg-muted"
                        : "bg-gradient-card border-border/50"
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