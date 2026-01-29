export default function SuccessSkeleton() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col transition-colors">
            {/* Header Skeleton */}
            <header className="max-w-[960px] mx-auto px-6 lg:px-10 py-4 w-full flex items-center justify-between border-b border-gray-100 dark:border-gray-800 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="size-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="size-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </header>

            <main className="flex flex-1 justify-center py-10 px-4">
                <div className="flex flex-col max-w-[600px] flex-1 items-center space-y-8 animate-pulse">
                    
                    {/* Success Icon & Title */}
                    <div className="flex flex-col items-center space-y-4 w-full">
                         <div className="size-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                         <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
                         <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>

                    {/* Order Details Card */}
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-xl h-48"></div>

                    {/* Next Steps */}
                    <div className="w-full space-y-4">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
                        <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
