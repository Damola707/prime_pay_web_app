

export function StateView({
    loading,
    error,
    isEmpty,
    onRetry,
    loadingText = "Loading...",
    errorTitle = "Error",
    emptyTitle = "No Data Found",
    emptyMessage = "There is no data to display.",
    showRetry = true,
    retryText = "Retry",
    children
}) {
    if (loading && isEmpty) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">{loadingText}</p>
                </div>
            </div>
        );
    }

    if (error && isEmpty) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">{errorTitle}</p>
                    <p className="mb-4">{error}</p>
                    {showRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {retryText}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!loading && !error && isEmpty) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">{emptyTitle}</p>
                    <p className="text-gray-600 mb-4">{emptyMessage}</p>
                    {showRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {retryText}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return children;
}

