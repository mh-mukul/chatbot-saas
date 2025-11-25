export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatConfig {
    // Display settings
    displayName?: string;
    placeholder?: string;

    // Theming
    theme?: 'light' | 'dark';
    primaryColor?: string;

    // Icons
    chatIcon?: React.ReactNode;

    // Layout
    containerClassName?: string;
    showHeader?: boolean;
    showTimestamp?: boolean;
}

export interface ChatFeatures {
    // Suggested questions
    suggestedQuestions?: string[];
    onSuggestedQuestionClick?: (question: string) => void;

    // Header actions
    headerActions?: React.ReactNode;
    onRefresh?: () => void;

    // Additional features
    showEmojiPicker?: boolean;
    enableMarkdown?: boolean;
}

export interface ChatCallbacks {
    onSendMessage: (message: string) => Promise<void> | void;
}

export interface ChatUIProps {
    // Core data
    messages: ChatMessage[];
    isLoading: boolean;

    // Configuration
    config?: ChatConfig;
    features?: ChatFeatures;

    // Callbacks
    callbacks: ChatCallbacks;
}
