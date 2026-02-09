export default function SupportLoading() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse">
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
                {/* Hero Skeleton */}
                <div className="text-center mb-16 space-y-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full mx-auto"></div>
                    <div className="h-12 bg-primary/10 rounded-lg w-1/2 mx-auto"></div>
                    <div className="h-6 bg-primary/5 rounded-lg w-2/3 mx-auto"></div>
                </div>

                {/* Support Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Info Cards */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-card-dark p-8 rounded-2xl border border-primary/5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-primary/10 rounded-full"></div>
                                    <div className="h-6 bg-primary/10 rounded w-1/2"></div>
                                </div>
                                <div className="h-4 bg-primary/5 rounded w-full"></div>
                                <div className="h-4 bg-primary/5 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form Skeleton */}
                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                        <div className="h-8 bg-primary/10 rounded w-1/2"></div>
                        <div className="h-4 bg-primary/5 rounded w-full"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-white dark:bg-card-dark rounded-xl"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 bg-primary/20 rounded-full"></div>
                            <div className="h-12 bg-primary/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
