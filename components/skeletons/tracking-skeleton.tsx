export default function TrackingSkeleton() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col transition-colors">
            {/* Header Skeleton */}
            <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-white dark:bg-[#2d1616] animate-pulse">
                <div className="max-w-[960px] mx-auto flex justify-between items-center">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="size-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
            </div>

            <main className="flex flex-1 justify-center py-10 px-4">
                <div className="flex flex-col max-w-[960px] flex-1 gap-6 animate-pulse">
                    
                    {/* Status Header Skeleton */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#2d1616] rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    </div>

                    {/* Timeline Skeleton */}
                    <div className="p-8 bg-white dark:bg-[#2d1616] rounded-xl border border-gray-100 dark:border-gray-800 space-y-8">
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="size-7 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                    {i !== 4 && <div className="w-[2px] h-12 bg-gray-200 dark:bg-gray-800 mt-2"></div>}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grid Skeletons */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#2d1616] rounded-xl border border-gray-100 dark:border-gray-800 h-48"></div>
                        <div className="bg-white dark:bg-[#2d1616] rounded-xl border border-gray-100 dark:border-gray-800 h-48"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
