import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    getChatWidgetSettings,
    updateChatWidgetSettings,
    chatWidgetSettings
} from '@/services/api/embed_chat_apis';

export const useWidgetSettings = (agentId: string | undefined) => {
    const [widgetSettings, setWidgetSettings] = useState<chatWidgetSettings | null>(null);
    const [initialWidgetSettings, setInitialWidgetSettings] = useState<chatWidgetSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chatIconFile, _setChatIconFile] = useState<File | null>(null);
    const { toast } = useToast();

    // Load widget settings when component mounts
    useEffect(() => {
        if (!agentId) {
            setIsLoading(false);
            return;
        }

        const fetchWidgetSettings = async () => {
            setIsLoading(true);
            try {
                const settings = await getChatWidgetSettings(agentId);
                setWidgetSettings(settings);
                setInitialWidgetSettings(settings);
            } catch (error) {
                toast({
                    title: "Error fetching widget settings",
                    description: "Could not load widget settings. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchWidgetSettings();
    }, [agentId, toast]);

    // Helper functions to update widget settings
    const setDisplayName = (display_name: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, display_name } : null));

    const setInitialMessages = (initial_message: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, initial_message } : null));

    const setSuggestedQuestions = (suggested_questions: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, suggested_questions } : null));

    const setMessagePlaceholder = (message_placeholder: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, message_placeholder } : null));

    const setChatTheme = (chat_theme: "light" | "dark") =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_theme } : null));

    const setChatIcon = (chat_icon: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_icon } : null));

    const setChatIconFile = (file: File | null) => {
        _setChatIconFile(file);
        if (file) {
            // Create a preview URL for the uploaded file
            const previewUrl = URL.createObjectURL(file);
            setWidgetSettings((prev) => (prev ? { ...prev, chat_icon: previewUrl } : null));
        }
    };

    const setChatAllignment = (chat_bubble_alignment: "left" | "right") =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_bubble_alignment } : null));

    const setIsPublic = (is_public: boolean) =>
        setWidgetSettings((prev) => (prev ? { ...prev, is_public } : null));

    const setPrimaryColor = (primary_color: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, primary_color } : null));

    const isChanged =
        widgetSettings && initialWidgetSettings
            ? widgetSettings.display_name !== initialWidgetSettings.display_name ||
            widgetSettings.initial_message !== initialWidgetSettings.initial_message ||
            widgetSettings.suggested_questions !== initialWidgetSettings.suggested_questions ||
            widgetSettings.message_placeholder !== initialWidgetSettings.message_placeholder ||
            widgetSettings.chat_theme !== initialWidgetSettings.chat_theme ||
            widgetSettings.chat_icon !== initialWidgetSettings.chat_icon ||
            widgetSettings.chat_bubble_alignment !== initialWidgetSettings.chat_bubble_alignment ||
            widgetSettings.is_public !== initialWidgetSettings.is_public ||
            widgetSettings.primary_color !== initialWidgetSettings.primary_color ||
            chatIconFile !== null
            : false;

    const handleSaveChanges = async () => {
        if (!widgetSettings || !isChanged) return;

        try {
            const updatedSettings = await updateChatWidgetSettings(agentId, widgetSettings, chatIconFile || undefined);
            setWidgetSettings(updatedSettings);
            setInitialWidgetSettings(updatedSettings);
            _setChatIconFile(null);
            toast({
                title: "Widget Settings Updated",
                description: "Your chat widget settings have been saved.",
            });
            return updatedSettings;
        } catch (error) {
            toast({
                title: "Error Saving Settings",
                description: "Could not save changes. Please try again.",
                variant: "destructive",
            });
            return null;
        }
    };

    const handleDiscardChanges = () => {
        if (initialWidgetSettings) {
            setWidgetSettings(initialWidgetSettings);
            _setChatIconFile(null);
            toast({
                title: "Changes Discarded",
                description: "Your changes have been discarded.",
            });
        }
    };

    return {
        agentId,
        widgetSettings,
        isLoading,
        isChanged,
        setDisplayName,
        setInitialMessages,
        setSuggestedQuestions,
        setMessagePlaceholder,
        setChatTheme,
        setChatIcon,
        setChatIconFile,
        setChatAllignment,
        setIsPublic,
        setPrimaryColor,
        handleSaveChanges,
        handleDiscardChanges,
    };
};
