import { FileText, Text, MessageCircleQuestion } from "lucide-react";

interface EmptyStateProps {
    type: 'files' | 'text' | 'qa';
}

const EmptyState = ({ type }: EmptyStateProps) => {
    const getIcon = () => {
        switch (type) {
            case 'files': return <FileText className="h-6 w-6 text-muted-foreground" />;
            case 'text': return <Text className="h-6 w-6 text-muted-foreground" />;
            case 'qa': return <MessageCircleQuestion className="h-6 w-6 text-muted-foreground" />;
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'files': return "No file sources yet";
            case 'text': return "No text sources yet";
            case 'qa': return "No Q&A pairs yet";
        }
    };

    const getMessage = () => {
        switch (type) {
            case 'files': return "Use the form above to upload files";
            case 'text': return "Use the form above to add text content";
            case 'qa': return "Use the form above to add Q&A pairs";
        }
    };

    return (
        <div className="text-center py-8 border border-dashed rounded-lg mt-6">
            <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                {getIcon()}
            </div>
            <h3 className="text-md font-medium mb-1">{getTitle()}</h3>
            <p className="text-sm text-muted-foreground">
                {getMessage()}
            </p>
        </div>
    );
};

export default EmptyState;
