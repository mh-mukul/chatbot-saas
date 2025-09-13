import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total Agents",
      value: "12",
      description: "Active AI agents",
      icon: Bot,
      trend: "+2 this week",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Conversations",
      value: "2,847",
      description: "Total conversations",
      icon: MessageSquare,
      trend: "+12% this month",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Active Users",
      value: "156",
      description: "Users this month",
      icon: Users,
      trend: "+5 new users",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      description: "Query resolution",
      icon: TrendingUp,
      trend: "+1.2% improvement",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor your AI agents and their performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title}
            className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-spring cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} shadow-lg`}>
                <metric.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-smooth">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
              <p className="text-xs text-primary font-medium mt-2">
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest agent interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { agent: "Customer Support Bot", activity: "Handled 23 queries", time: "2 minutes ago" },
              { agent: "Sales Assistant", activity: "Generated 5 leads", time: "15 minutes ago" },
              { agent: "FAQ Bot", activity: "Updated knowledge base", time: "1 hour ago" },
              { agent: "Technical Support", activity: "Resolved 8 tickets", time: "2 hours ago" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <div>
                  <p className="font-medium text-sm">{item.agent}</p>
                  <p className="text-xs text-muted-foreground">{item.activity}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Performing Agents</CardTitle>
            <CardDescription>Best agents by success rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Customer Support Bot", rate: "98.5%", queries: "1,247" },
              { name: "Sales Assistant", rate: "96.2%", queries: "892" },
              { name: "FAQ Bot", rate: "94.8%", queries: "568" },
              { name: "Technical Support", rate: "92.1%", queries: "340" }
            ].map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.queries} queries handled</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{agent.rate}</p>
                  <p className="text-xs text-muted-foreground">success rate</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;