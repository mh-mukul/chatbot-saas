import { Button } from "@/components/ui/button";
import { ChatConfig } from "./types";

interface ChatHeaderProps {
    title: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    config?: ChatConfig;
}

export function ChatHeader({ title, icon, actions, config }: ChatHeaderProps) {
    return (
        <div className="px-4 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
                {icon && (
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground scale-110"
                        style={config?.primaryColor ? { backgroundColor: config.primaryColor } : {}}
                    >
                        {icon}
                    </div>
                )}
                <h2 className="font-medium">{title}</h2>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
