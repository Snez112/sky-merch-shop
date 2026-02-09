export default function OrdersLoading() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse">
            <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
                {/* Header Skeleton */}
                <div className="text-center mb-12 space-y-4">
                    <div className="h-12 bg-primary/10 rounded-lg w-2/3 mx-auto"></div>
                    <div className="h-6 bg-primary/5 rounded-lg w-1/2 mx-auto"></div>
                </div>

                {/* Search Form Skeleton */}
                <div className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-primary/5 space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-50 dark:bg-[#0a1628] rounded-xl"></div>
                    </div>
                    <div className="h-12 bg-primary/20 rounded-full"></div>
                </div>
            </main>
        </div>
    );
}
