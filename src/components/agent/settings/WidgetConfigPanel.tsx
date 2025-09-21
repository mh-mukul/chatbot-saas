import { chatWidgetSettings } from "@/services/embed_chat_apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface WidgetConfigPanelProps {
    widgetSettings: chatWidgetSettings;
    isChanged: boolean;
    onDisplayNameChange: (name: string) => void;
    onInitialMessagesChange: (messages: string) => void;
    onSuggestedMessagesChange: (messages: string) => void;
    onMessagePlaceholderChange: (placeholder: string) => void;
    onChatThemeChange: (theme: "light" | "dark") => void;
    onChatIconChange: (icon: string) => void;
    onChatAllignmentChange: (allignment: "left" | "right") => void;
    onIsPrivateChange: (isPrivate: boolean) => void;
    onPrimaryColorChange: (color: string) => void;
    onSaveChanges: () => Promise<any>;
    onDiscardChanges?: () => void;
}

const WidgetConfigPanel = ({
    widgetSettings,
    isChanged,
    onDisplayNameChange,
    onInitialMessagesChange,
    onSuggestedMessagesChange,
    onMessagePlaceholderChange,
    onChatThemeChange,
    onChatIconChange,
    onChatAllignmentChange,
    onIsPrivateChange,
    onPrimaryColorChange,
    onSaveChanges,
    onDiscardChanges = () => { },
}: WidgetConfigPanelProps) => {
    return (
        <div className="relative w-full md:w-[500px] border-b md:border-b-0 md:border-r flex flex-col">
            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-6 space-y-6 pb-32">
                    <div>
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            Widget Configuration
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Configure how your chat widget appears and functions on your website.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="display-name" className="text-sm font-medium">
                                Display Name
                            </Label>
                            <Input
                                id="display-name"
                                value={widgetSettings.display_name || ""}
                                onChange={(e) => onDisplayNameChange(e.target.value)}
                                className="mt-1"
                                placeholder="Chat Assistant"
                            />
                        </div>

                        <div>
                            <Label htmlFor="initial-messages" className="text-sm font-medium">
                                Initial Messages
                            </Label>
                            <Textarea
                                id="initial-messages"
                                value={widgetSettings.initial_messages || ""}
                                onChange={(e) => onInitialMessagesChange(e.target.value)}
                                className="mt-1"
                                placeholder="Hello! How can I help you today?"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separate each message with a new line
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="suggested-messages" className="text-sm font-medium">
                                Suggested Questions
                            </Label>
                            <Textarea
                                id="suggested-messages"
                                value={widgetSettings.suggested_messages || ""}
                                onChange={(e) => onSuggestedMessagesChange(e.target.value)}
                                className="mt-1"
                                placeholder="What services do you offer?\nHow do I contact support?\nWhat are your business hours?"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separate each question with a new line
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="message-placeholder" className="text-sm font-medium">
                                Input Placeholder
                            </Label>
                            <Input
                                id="message-placeholder"
                                value={widgetSettings.message_placeholder || ""}
                                onChange={(e) => onMessagePlaceholderChange(e.target.value)}
                                className="mt-1"
                                placeholder="Ask anything..."
                            />
                        </div>

                        <div>
                            <Label htmlFor="chat-theme" className="text-sm font-medium">
                                Appearance
                            </Label>
                            <Select
                                value={widgetSettings.chat_theme}
                                onValueChange={(value: "light" | "dark") => onChatThemeChange(value)}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="chat-icon" className="text-sm font-medium">
                                Chat Icon URL
                            </Label>
                            <Input
                                id="chat-icon"
                                value={widgetSettings.chat_icon || ""}
                                onChange={(e) => onChatIconChange(e.target.value)}
                                className="mt-1"
                                placeholder="https://example.com/icon.png"
                            />
                        </div>

                        <div>
                            <Label htmlFor="chat-alignment" className="text-sm font-medium">
                                Widget Position
                            </Label>
                            <Select
                                value={widgetSettings.chat_bubble_alignment}
                                onValueChange={(value: "left" | "right") => onChatAllignmentChange(value)}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="primary-color" className="text-sm font-medium">
                                Primary Color
                            </Label>
                            <div className="flex mt-1 gap-2">
                                <Input
                                    id="primary-color"
                                    type="text"
                                    value={widgetSettings.primary_color || "#0099ff"}
                                    onChange={(e) => onPrimaryColorChange(e.target.value)}
                                    className="flex-1"
                                    placeholder="#0099ff"
                                />
                                <Input
                                    type="color"
                                    value={widgetSettings.primary_color || "#0099ff"}
                                    onChange={(e) => onPrimaryColorChange(e.target.value)}
                                    className="w-12 h-10 p-1 cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Used for chat icon, header and user messages
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={widgetSettings.is_private}
                                onCheckedChange={onIsPrivateChange}
                                id="is-private"
                            />
                            <Label htmlFor="is-private" className="text-sm font-medium">
                                Private Chat
                            </Label>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            {/* Bottom sheet (fixed within container) */}
            {
                isChanged && (
                    <div className="absolute bottom-0 left-0 right-0 z-50 bg-background border-t p-4 shadow-lg animate-in slide-in-from-bottom">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-medium">Unsaved Changes</h3>
                            <p className="text-sm text-muted-foreground">
                                Would you like to save or discard your changes?
                            </p>
                        </div>
                        <div className="flex w-full justify-between gap-4">
                            <Button variant="outline" className="flex-1" onClick={onDiscardChanges}>
                                Discard
                            </Button>
                            <Button className="flex-1" onClick={onSaveChanges}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default WidgetConfigPanel;
