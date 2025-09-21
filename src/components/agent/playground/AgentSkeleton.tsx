import { Skeleton } from "@/components/ui/skeleton";

const AgentSkeleton = () => (
    <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel - Configuration Skeleton */}
        <div className="w-full md:w-96 border-b md:border-b-0 md:border-r p-6 space-y-6">
            <div>
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <Skeleton className="h-9 w-full" />

                <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-40 mt-1" />
                </div>

                <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>

        {/* Right Panel - Chat Interface Skeleton */}
        <div className="flex-1 flex items-center justify-center dotted-background">
            <div className="flex flex-col h-[90vh] max-w-md w-full mx-auto border rounded-2xl bg-background shadow-lg">
                {/* Header Skeleton */}
                <div className="px-4 py-3 border-b flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-8" />
                </div>

                {/* Messages Skeleton */}
                <div className="flex-1 p-4 space-y-4">
                    {/* Bot message skeleton */}
                    <div className="flex items-end gap-2 justify-start">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    {/* User message skeleton */}
                    <div className="flex items-end gap-2 justify-end">
                        <div className="flex flex-col gap-1 items-end">
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                    {/* Bot message skeleton */}
                    <div className="flex items-end gap-2 justify-start">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>

                {/* Footer Input Skeleton */}
                <div className="p-3 border-t flex gap-2 items-center">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>
        </div>
    </div>
);

export default AgentSkeleton;
