import React from 'react';

export default function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero Heading Skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-10 md:h-16 w-3/4 md:w-1/2 mx-auto bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-6 w-full max-w-2xl mx-auto bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4 lg:gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse relative overflow-hidden">
               {/* Content inside card mimicking ProductPackCard */}
               <div className="absolute inset-0 p-6 flex flex-col justify-between">
                   <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                   <div className="space-y-2">
                       <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                       <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                   </div>
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
