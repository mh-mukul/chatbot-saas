import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "@/services/api/source_apis";

interface PaginationControlsProps {
    pagination: Pagination | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PaginationControls = ({ pagination, currentPage, onPageChange }: PaginationControlsProps) => {
    if (!pagination || pagination.total_pages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pagination.total_pages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
                Showing page {currentPage} of {pagination.total_pages} ({pagination.total_records} total)
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === pagination.total_pages}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default PaginationControls;
