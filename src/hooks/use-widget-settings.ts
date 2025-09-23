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
                const settings = await getChatWidgetSettings(Number(agentId));
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

    const setInitialMessages = (initial_messages: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, initial_messages } : null));

    const setSuggestedMessages = (suggested_messages: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, suggested_messages } : null));

    const setMessagePlaceholder = (message_placeholder: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, message_placeholder } : null));

    const setChatTheme = (chat_theme: "light" | "dark") =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_theme } : null));

    const setChatIcon = (chat_icon: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_icon } : null));

    const setChatAllignment = (chat_bubble_alignment: "left" | "right") =>
        setWidgetSettings((prev) => (prev ? { ...prev, chat_bubble_alignment } : null));

    const setIsPrivate = (is_private: boolean) =>
        setWidgetSettings((prev) => (prev ? { ...prev, is_private } : null));

    const setPrimaryColor = (primary_color: string) =>
        setWidgetSettings((prev) => (prev ? { ...prev, primary_color } : null));

    const isChanged =
        widgetSettings && initialWidgetSettings
            ? widgetSettings.display_name !== initialWidgetSettings.display_name ||
            widgetSettings.initial_messages !== initialWidgetSettings.initial_messages ||
            widgetSettings.suggested_messages !== initialWidgetSettings.suggested_messages ||
            widgetSettings.message_placeholder !== initialWidgetSettings.message_placeholder ||
            widgetSettings.chat_theme !== initialWidgetSettings.chat_theme ||
            widgetSettings.chat_icon !== initialWidgetSettings.chat_icon ||
            widgetSettings.chat_bubble_alignment !== initialWidgetSettings.chat_bubble_alignment ||
            widgetSettings.is_private !== initialWidgetSettings.is_private ||
            widgetSettings.primary_color !== initialWidgetSettings.primary_color
            : false;

    const handleSaveChanges = async () => {
        if (!widgetSettings || !isChanged) return;

        try {
            const updatedSettings = await updateChatWidgetSettings(widgetSettings);
            setWidgetSettings(updatedSettings);
            setInitialWidgetSettings(updatedSettings);
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
            toast({
                title: "Changes Discarded",
                description: "Your changes have been discarded.",
            });
        }
    };

    return {
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
        handleDiscardChanges,
    };
};
