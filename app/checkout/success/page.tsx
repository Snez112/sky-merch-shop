"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    const [orderData, setOrderData] = useState({
        id: "#HOG-00000",
        hearts: 0,
        price: 0,
        code: ""
    });

    useEffect(() => {
        setMounted(true);
        
        // Try getting data from session storage first
        let amount = 0;
        let quantity = 0;
        let code = "";

        try {
            const sessionData = sessionStorage.getItem('checkoutData');
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                amount = parsed.amount;
                quantity = parsed.quantity;
                code = parsed.code;
            }
        } catch (e) {
            console.error("Error parsing session data", e);
        }

        // Override with query params if present (for fake bill testing)
        const paramAmount = searchParams.get('amount');
        const paramHearts = searchParams.get('hearts');
        const paramCode = searchParams.get('code');

        if (paramAmount) amount = Number(paramAmount);
        if (paramHearts) quantity = Number(paramHearts);
        if (paramCode) code = paramCode;

        // Fallback to random fake data for UI testing if no data found
        if (!amount && !quantity) {
             const randomHearts = [30, 60, 100, 360, 500, 1000][Math.floor(Math.random() * 6)];
             quantity = randomHearts;
             amount = randomHearts * 250; // Approx price
             code = ""; // Will generate random ID below
        }

        setOrderData({
            id: code ? `#${code.slice(0, 8).toUpperCase()}` : `#HOG-${Math.floor(10000 + Math.random() * 90000)}`,
            hearts: quantity,
            price: amount,
            code: code || "demo-code" 
        });
        
        // Optional: Clear session data after retrieving (commented out to allow refresh for now, or uncomment to be strict)
        // sessionStorage.removeItem('checkoutData');

    }, [searchParams]);

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#1c0d0d] dark:text-white transition-colors min-h-screen flex flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-100 dark:border-gray-800 px-6 lg:px-10 py-4 max-w-[960px] mx-auto w-full">
                <Link href="/" className="flex items-center gap-4 text-primary">
                    <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                    </div>
                    <h2 className="text-[#1c0d0d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Heart of the Game</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8">
                     {/* User avatar placeholder (preserved from design) */}
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" 
                         style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-0C6TGIERc3m9Nnbd333OTzvzf9i5X68n3jEvMjOoBPkYv7vMsk7G0Pk-Th3nk-M2cMcjhsHqkF0w_rSbx5ctRudwuz9_Fino2__PFU8zTY4ZsWFbZRpIcG-D0i_TcyOx7pPQ_1-1CEIIrBvPM7bNPy7hcXKxzKvoXVt0IQ_uRHsSN_sq79m7kjWDAjCkO9uZKU8dnnUqd4ZwArwLEA0qGkS6ph3X1lTHYkerUpwaOri-21EtQzN6PejFRhgrz2rMIKfTMRQHbio")'}}>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 justify-center py-10 px-4">
                <div className="flex flex-col max-w-[600px] flex-1 text-center">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                            <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
                        </div>
                        <h1 className="text-primary tracking-tight text-[36px] font-bold leading-tight">Payment Successful!</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Thank you for your purchase. Your hearts are on the way!</p>
                    </div>

                    <div className="bg-white dark:bg-[#2d1818] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Order ID</p>
                            <p className="text-[#1c0d0d] dark:text-white text-sm font-bold">{orderData.id}</p>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Hearts</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                                <p className="text-[#1c0d0d] dark:text-white text-sm font-bold">{orderData.hearts}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Price Paid</p>
                            <p className="text-[#1c0d0d] dark:text-white text-sm font-bold">{orderData.price.toLocaleString('vi-VN')}đ</p>
                        </div>
                    </div>

                    <div className="text-left mb-10">
                        <h2 className="text-[#1c0d0d] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6 text-center">Next Steps & Instructions</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start bg-white dark:bg-[#2d1818] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1c0d0d] dark:text-white">Processing</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Your order is being verified by our system.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start bg-white dark:bg-[#2d1818] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1c0d0d] dark:text-white">Check your Candle Note</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Our team will visit your location within 15-30 minutes. Please ensure you are online.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#2d1818] p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex gap-4 items-start mb-4">
                                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                        <span className="material-symbols-outlined">favorite</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1c0d0d] dark:text-white">Receive Hearts</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Hearts will be delivered directly to your note. Enjoy the game!</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-start sm:ml-12">
                                    <Link 
                                        href={`/orders/${orderData.code}`}
                                        className="flex-1 sm:flex-none text-center px-4 py-2 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary/5 transition-colors block"
                                    >
                                        Order Detail
                                    </Link>
                                    <Link 
                                        href="/" 
                                        className="flex-1 sm:flex-none text-center px-4 py-2 border border-secondary text-primary text-sm font-semibold rounded-lg hover:bg-secondary/10 transition-colors"
                                    >
                                        Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/20 dark:bg-secondary/10 p-8 rounded-xl flex flex-col items-center gap-6 mb-8">
                        <h3 className="text-[#1c0d0d] dark:text-white font-bold text-lg">Need Help? Contact Support</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                            <a className="flex flex-col items-center justify-center gap-2 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="bg-[#1877F2]/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                                    {/* Facebook Icon */}
                                    <svg className="size-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Facebook</span>
                            </a>
                            <a className="flex flex-col items-center justify-center gap-2 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-xl">mail</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Email</span>
                            </a>
                            <a className="flex flex-col items-center justify-center gap-2 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="bg-[#5865F2]/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[#5865F2] text-xl">forum</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Discord</span>
                            </a>
                            <a className="flex flex-col items-center justify-center gap-2 p-3 bg-white/50 dark:bg-white/5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="bg-[#0088cc]/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[#0088cc] text-xl">send</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Telegram</span>
                            </a>
                        </div>
                    </div>
                    <div className="pb-10"></div>
                </div>
            </main>
            
             <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl rounded-full"></div>
             <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-secondary/5 to-transparent blur-3xl rounded-full"></div>
        </div>
    );
}
