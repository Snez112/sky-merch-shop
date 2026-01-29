"use strict";
"use client";

import HeartPacks from "@/components/shop/heart-packs";
import { ShoppingBag } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1c0d0d] dark:text-white transition-colors">
            {/* Header / Hero */}
            <div className="relative bg-white dark:bg-[#2d1616] border-b border-[#e9cfce] dark:border-[#3d2424] py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-4">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1c0d0d] dark:text-white tracking-tight">
                        Cửa Hàng Vật Phẩm
                    </h1>
                    <p className="text-lg text-[#9d4a48] dark:text-gray-400 max-w-2xl mx-auto">
                        Chọn gói Heart phù hợp để nâng cấp chòm sao của bạn. Giao dịch an toàn - Nhanh chóng - Uy tín.
                    </p>
                </div>
            </div>

            {/* Products Section */}
            <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pb-20">
                {/* Reusing the Shop Component */}
                <HeartPacks />
            </main>
        </div>
    );
}
