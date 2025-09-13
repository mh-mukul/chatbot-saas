import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Construction } from "lucide-react";

const Settings = () => {
  const { id } = useParams();

  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <Card className="bg-gradient-card border-border/50 shadow-card max-w-md w-full text-center">
        <CardHeader className="pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary/20 rounded-2xl flex items-center justify-center mb-4">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </CardTitle>
          <CardDescription>
            Agent configuration and settings will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This section will allow you to configure advanced settings, permissions, and preferences for your AI agent.
          </p>
          <Button disabled className="bg-gradient-primary/50">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;