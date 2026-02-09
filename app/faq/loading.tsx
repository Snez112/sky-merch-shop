export default function FAQLoading() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse">
            <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
                {/* Header Skeleton */}
                <div className="bg-white dark:bg-card-dark rounded-2xl p-8 space-y-4">
                    <div className="h-10 bg-primary/10 rounded-lg w-1/3 mx-auto"></div>
                    <div className="h-6 bg-primary/5 rounded-lg w-2/3 mx-auto"></div>
                </div>

                {/* FAQ Items Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white dark:bg-card-dark rounded-lg border border-primary/5 p-5 space-y-3">
                            <div className="h-6 bg-primary/10 rounded w-3/4"></div>
                            <div className="h-4 bg-primary/5 rounded w-full"></div>
                            <div className="h-4 bg-primary/5 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>

                {/* CTA Skeleton */}
                <div className="bg-gradient-to-br from-red-50 to-white dark:from-primary/5 dark:to-card-dark rounded-2xl p-8 border border-primary/5">
                    <div className="h-8 bg-primary/10 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-6 bg-primary/5 rounded w-3/4 mx-auto"></div>
                </div>
            </main>
        </div>
    );
}
