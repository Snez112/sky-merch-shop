export default function ProductSectionLoading() {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <div className="h-10 bg-muted rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse" />
                </div>

                {/* Product Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative">
                            {/* Image Skeleton */}
                            <div className="relative overflow-hidden rounded-lg bg-muted mb-4 aspect-square animate-pulse" />
                            
                            {/* Text Skeletons */}
                            <div className="space-y-2 text-center">
                                <div className="h-6 bg-muted rounded w-3/4 mx-auto animate-pulse" />
                                <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
                                <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse" />
                            </div>
                            
                            {/* Button Skeleton */}
                            <div className="mt-4">
                                <div className="h-10 bg-muted rounded-md animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons Skeleton */}
                <div className="text-center flex items-center justify-center gap-4">
                    <div className="h-12 bg-muted rounded-lg w-48 animate-pulse" />
                    <div className="h-12 bg-muted rounded-lg w-48 animate-pulse" />
                </div>
            </div>
        </section>
    );
}
