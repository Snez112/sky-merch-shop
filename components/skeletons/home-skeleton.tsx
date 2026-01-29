export default function HomeSkeleton() {
    return (
        <main className="max-w-[1200px] mx-auto px-6 lg:px-10 font-display min-h-screen">
             {/* Hero Section Skeleton */}
            <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col gap-8">
                     {/* Badge */}
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    
                    {/* Title */}
                    <div className="space-y-4">
                        <div className="h-16 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-16 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Paragraph */}
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex gap-4">
                        <div className="h-14 w-40 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                        <div className="h-14 w-40 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                    </div>
                </div>
                
                {/* Fast Buy Card Skeleton */}
                <div className="w-full h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            </section>

             {/* Products Grid Skeleton */}
             <section className="py-20">
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto mb-16"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
             </section>
        </main>
    );
}
