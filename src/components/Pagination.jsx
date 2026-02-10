
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize,
    showInfo = true,
    className = ""
}) {
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItems);

    if (totalPages <= 1 && !showInfo) return null;

    return (
        <div className={`mt-6 flex items-center justify-between ${className}`}>
            {showInfo && (
                <p className="text-sm text-gray-600">
                    Showing {startIndex}-{endIndex} of{" "}
                    <span className="font-semibold">{totalItems}</span> entries
                </p>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "border hover:bg-gray-50"
                                    }`}
                                aria-label={`Page ${pageNum}`}
                                aria-current={currentPage === pageNum ? "page" : undefined}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="px-2 py-2 flex items-center">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-10 h-10 rounded-lg border hover:bg-gray-50 transition-colors"
                                aria-label={`Page ${totalPages}`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
