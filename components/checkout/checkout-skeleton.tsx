export default function CheckoutSkeleton() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors">
            {/* Header Skeleton */}
            <header className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 w-full animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="w-24 flex justify-end">
                     <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-10 w-full flex-1">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center gap-2 mb-8 animate-pulse">
                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="size-3 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     {/* Left Column: Order Summary Skeleton */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6"></div>
                        
                        {/* Product Card Skeleton */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                                <div className="flex flex-col justify-center flex-1 space-y-2">
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-1"></div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown Skeleton */}
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Details Skeleton */}
                    <div className="lg:col-span-7 space-y-8">
                         <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                                </div>
                                
                                <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                
                                <div className="h-14 w-full bg-primary/20 rounded-full animate-pulse mt-8"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
