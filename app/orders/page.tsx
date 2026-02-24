"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OrderSearchPage() {
    const router = useRouter();
    const [orderCode, setOrderCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderCode.trim()) return;

        setIsLoading(true);
        // Simulate a small delay for UX or immediately push
        router.push(`/orders/${orderCode.trim()}`);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-6 transition-colors">
            
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl">search</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1c0d0d] dark:text-white">Kiểm Tra Đơn Hàng</h1>
                    <p className="text-gray-500 dark:text-gray-400">Nhập mã đơn hàng của bạn để kiểm tra trạng thái gửi tim (heart).</p>
                </div>

                <form onSubmit={handleSearch} className="bg-white dark:bg-card-dark p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-bold text-[#1c0d0d] dark:text-white ml-1">Mã Đơn Hàng</label>
                        <div className="relative">
                            <input
                                id="code"
                                type="text"
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value)}
                                placeholder="Ví dụ: SKY0-1234-5678"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0a1628] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-[#1c0d0d] dark:text-white placeholder:text-gray-400"
                                required
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">qr_code_2</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !orderCode.trim()}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Kiểm Tra Đơn Hàng</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <a href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Quay lại Trang Chủ
                    </a>
                </div>
            </div>

            {/* Background elements */}
            <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
