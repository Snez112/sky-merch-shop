export default function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-muted animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container max-w-2xl mx-auto px-4 py-8">
                <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    {/* Order Summary Skeleton */}
                    <div className="p-6 border-b bg-muted/30 space-y-4">
                        <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                                <div className="h-7 w-32 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Skeleton */}
                    <div className="p-6 flex flex-col items-center space-y-4">
                        <div className="text-center space-y-2">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto"></div>
                            <div className="h-7 w-40 bg-muted rounded animate-pulse mx-auto"></div>
                        </div>

                        <div className="w-[250px] h-[250px] bg-muted rounded-lg animate-pulse"></div>

                        <div className="w-full space-y-2 bg-muted/30 p-4 rounded-lg">
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>

                        <div className="w-full h-20 bg-muted/30 rounded-lg animate-pulse"></div>

                        <div className="w-full space-y-2">
                            <div className="h-10 w-full bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-10 w-full bg-muted rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
