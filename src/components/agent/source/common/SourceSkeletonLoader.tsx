import { Skeleton } from "@/components/ui/skeleton";

const SourceSkeletonLoader = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-16 w-full" />
            </div>
        ))}
    </div>
);

export default SourceSkeletonLoader;
