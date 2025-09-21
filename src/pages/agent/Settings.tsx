import { useParams } from "react-router-dom";
import { useWidgetSettings } from "@/hooks/use-widget-settings";
import WidgetConfigPanel from "@/components/agent/widget/WidgetConfigPanel";
import WidgetPreview from "@/components/agent/widget/WidgetPreview";
import AgentSkeleton from "@/components/agent/playground/AgentSkeleton";

const Settings = () => {
  const { id } = useParams<{ id: string }>();

  // Use our custom hook to handle widget settings
  const {
    widgetSettings,
    isLoading,
    isChanged,
    setDisplayName,
    setInitialMessages,
    setSuggestedMessages,
    setMessagePlaceholder,
    setChatTheme,
    setChatIcon,
    setChatAllignment,
    setIsPrivate,
    setPrimaryColor,
    handleSaveChanges,
    handleDiscardChanges
  } = useWidgetSettings(id);

  if (isLoading || !widgetSettings) {
    return <AgentSkeleton />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel - Configuration */}
      <WidgetConfigPanel
        widgetSettings={widgetSettings}
        isChanged={isChanged}
        onDisplayNameChange={setDisplayName}
        onInitialMessagesChange={setInitialMessages}
        onSuggestedMessagesChange={setSuggestedMessages}
        onMessagePlaceholderChange={setMessagePlaceholder}
        onChatThemeChange={setChatTheme}
        onChatIconChange={setChatIcon}
        onChatAllignmentChange={setChatAllignment}
        onIsPrivateChange={setIsPrivate}
        onPrimaryColorChange={setPrimaryColor}
        onSaveChanges={handleSaveChanges}
        onDiscardChanges={handleDiscardChanges}
      />

      {/* Right Panel - Chat Widget Preview */}
      <div className="flex-1 flex items-center justify-center dotted-background">
        <WidgetPreview widgetSettings={widgetSettings} />
      </div>
    </div>
  );
};

export default Settings;