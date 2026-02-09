export default function OrderDetailLoading() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse">
            <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                {/* Header Skeleton */}
                <div className="text-center mb-12 space-y-4">
                    <div className="h-12 bg-primary/10 rounded-lg w-1/2 mx-auto"></div>
                    <div className="h-6 bg-primary/5 rounded-lg w-1/3 mx-auto"></div>
                </div>

                {/* Order Details Card Skeleton */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-primary/5 p-8 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <div className="h-8 w-32 bg-primary/20 rounded-full"></div>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                            <div className="h-6 bg-primary/10 rounded w-1/3"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                            <div className="h-6 bg-primary/10 rounded w-1/3"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-primary/10 rounded w-1/4"></div>
                            <div className="h-6 bg-primary/10 rounded w-1/3"></div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-primary/10"></div>

                    {/* Timeline Skeleton */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="size-8 bg-primary/10 rounded-full shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-primary/10 rounded w-1/3"></div>
                                    <div className="h-4 bg-primary/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button Skeleton */}
                <div className="mt-8">
                    <div className="h-12 bg-primary/20 rounded-full"></div>
                </div>
            </main>
        </div>
    );
}
