"use client";

import { useParams, useRouter } from "next/navigation";
import { securePost } from "@/lib/client/secure-fetch";
import TrackingSkeleton from "@/components/skeletons/tracking-skeleton";
import { ORDER_STATUS } from "@/types/order";
import { cachedReq } from "@/lib/utils";
import { convertBankTransactions, getCleanContent } from "@/lib/utils/bank-converter";
import { formatDateTime } from "@/lib/utils/date";
import useSWR from "swr";

export default function OrderTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;

    // Helper to format date consistent with UI
    const formatDateDisplay = (dateStr: string | undefined) => {
        if (!dateStr) return "--:--";
        try {
            // Check if it's an ISO string (e.g. from API date object)
            if (dateStr.includes('T') || (dateStr.includes('-') && !dateStr.includes('/'))) {
                 const formatted = formatDateTime(new Date(dateStr));
                 const [time, date] = formatted.split(' ');
                 return `${date} ${time}`;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    // SWR fetcher function
    const fetcher = async () => {
        if (!code) throw new Error("Code is required");

        // Parallel API calls for better performance
        const [bankRes, orderResult] = await Promise.all([
            cachedReq('/api/checkBank').catch(err => {
                console.error("Error fetching bank data:", err);
                return { data: [] }; // Graceful fallback
            }),
            securePost('/api/checkOrderStatus', { code })
        ]);
        
        // Check order status first
        if (orderResult.status === ORDER_STATUS.NOT_FOUND) {
            throw new Error("Order not found. Please check your code and try again.");
        }
        
        // Process bank data
        let match = null;
        const responseJson = bankRes.data;
        
        if (Array.isArray(responseJson)) {
            // Convert to English keys
            const transactions = convertBankTransactions(responseJson);
            
            // Find transaction matching the code
            match = transactions.find((t) => 
                t.content.toLowerCase().includes(code.toLowerCase())
            );
        }
        
        return {
            order: orderResult.data,
            verifyingDetails: match,
            hasCheckedBank: true
        };
    };

    // Use SWR for data fetching with caching
    const { data, error, isLoading } = useSWR(
        code ? `/orders/${code}` : null,
        fetcher,
        {
            revalidateOnFocus: false, // Don't refetch on window focus
            revalidateOnReconnect: false, // Don't refetch on reconnect
            dedupingInterval: 10000, // Dedupe requests within 10s
        }
    );

    if (isLoading) return <TrackingSkeleton />;

    if (error || !data) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-6 transition-colors">
                <div className="bg-white dark:bg-[#2d1616] p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 text-center max-w-md w-full">
                    <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1c0d0d] dark:text-white mb-2">Order Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{error?.message || "We couldn't find an order with this code."}</p>
                    <button 
                        onClick={() => router.push('/orders')}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Another Code
                    </button>
                    <button 
                        onClick={() => router.push('/')}
                        className="w-full mt-3 text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const { order, verifyingDetails, hasCheckedBank } = data;

    // Status Logic
    const status = order.ORDER_STATUS ? order.ORDER_STATUS.toLowerCase() : "";
    const isPaid = (status !== "pending" && status !== "created") || !!verifyingDetails; 
    const isProcessed = isPaid && (order.ALREADYSENT > 0 || status === "processing");
    const isDone = status === "done" || status === "completed";
    
    // Calculate progress
    const progressPercent = Math.min(100, Math.round((order.ALREADYSENT / order.AMOUNT) * 100)) || 0;
    const isFullySent = order.AMOUNT > 0 && (order.ALREADYSENT || 0) >= order.AMOUNT;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#1c0d0d] dark:text-white transition-colors min-h-screen flex flex-col">
            
            {/* ... (Start of Main) ... */}
            <main className="flex flex-1 justify-center py-10 px-4">
                <div className="flex flex-col max-w-[960px] flex-1 gap-6">
                    
                    {/* Status Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-[#2d1616] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424]">
                        <div>
                            <p className="text-[#1c0d0d] dark:text-white text-3xl font-black leading-tight tracking-tight">Order #{code.toUpperCase()}</p>
                            <p className="text-[#9d4a48] dark:text-gray-400 text-sm mt-1">Status: Tracking Details</p>
                        </div>
                        <div className={`flex min-w-[120px] items-center justify-center overflow-hidden rounded-lg h-10 px-6 border text-sm font-bold tracking-wide capitalize
                            ${isDone ? 'bg-green-100 text-green-700 border-green-200' : 'bg-status-info/20 text-[#1a5b75] border-status-info'}
                        `}>
                            {order.ORDER_STATUS || "Unknown"}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-8 bg-white dark:bg-[#2d1616] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424]">
                        <h3 className="text-lg font-bold mb-8 text-[#1c0d0d] dark:text-white">Delivery Progress</h3>
                        <div className="flex flex-col gap-0">
                            
                            {/* Step 1: Created */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-green-500 text-[28px] fill-[1]">check_circle</span>
                                    <div className="w-[2px] bg-green-500 h-12"></div>
                                </div>
                                <div className="flex flex-1 items-start justify-between pb-6">
                                    <div>
                                        <p className="text-[#1c0d0d] dark:text-white text-base font-semibold">Order Created</p>
                                        <p className="text-green-600 dark:text-green-400 text-sm">Verified</p>
                                    </div>
                                    <div className="text-[#9d4a48] dark:text-gray-400 text-sm font-medium mt-1">{formatDateDisplay(order.TIME_CREATE) || "N/A"}</div>
                                </div>
                            </div>

                            {/* Step 2: Payment */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className={`material-symbols-outlined text-[28px] ${isPaid ? 'text-green-500 fill-[1]' : 'text-gray-300 dark:text-gray-600'}`}>
                                        {isPaid ? 'check_circle' : 'radio_button_unchecked'}
                                    </span>
                                    <div className={`w-[2px] h-12 ${isPaid ? 'bg-green-500' : 'bg-[#e9cfce] dark:bg-[#3d2424]'}`}></div>
                                </div>
                                <div className="flex flex-1 items-start justify-between pb-6">
                                    <div>
                                        <p className={`text-base font-semibold ${isPaid ? 'text-[#1c0d0d] dark:text-white' : 'text-gray-400'}`}>Payment Received</p>
                                        <p className={`${isPaid ? 'text-green-600 dark:text-green-400' : (hasCheckedBank ? 'text-red-500' :'text-gray-400')} text-sm`}>
                                            {isPaid ? 'Verified' : (hasCheckedBank ? 'Transaction Not Found' : 'Scanning...')}
                                        </p>
                                        {isPaid && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Content: <span className="font-mono font-bold text-[#1c0d0d] dark:text-gray-300">
                                                    {verifyingDetails?.content 
                                                        ? getCleanContent(verifyingDetails.content, code) 
                                                        : (order.BANK_CODE || "Verifying...")}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-[#9d4a48] dark:text-gray-400 text-sm font-medium mt-1">
                                        {formatDateDisplay(order.BANK_TIME || verifyingDetails?.date)}
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Progress */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className={`material-symbols-outlined text-[28px] ${isFullySent ? 'text-green-500' : (isPaid ? 'text-primary' : 'text-gray-300 dark:text-gray-600')}`}>
                                        {isFullySent ? 'check_circle' : (progressPercent > 0 ? 'radio_button_checked' : 'radio_button_unchecked')}
                                    </span>
                                    <div className={`w-[2px] h-12 ${isDone ? 'bg-green-500' : 'bg-[#e9cfce] dark:bg-[#3d2424]'}`}></div>
                                </div>
                                <div className="flex flex-1 items-start justify-between pb-6">
                                    <div>
                                        <p className={`text-base font-semibold ${isPaid ? 'text-[#1c0d0d] dark:text-white' : 'text-gray-400'}`}>Order Progress</p>
                                        <p className={`${isFullySent ? 'text-green-600' : 'text-primary'} text-sm font-medium`}>
                                            {(order.ALREADYSENT || 0).toLocaleString()} / {(order.AMOUNT || 0).toLocaleString()} Hearts
                                        </p>
                                        {/* Progress Bar */}
                                        <div className="w-full max-w-[200px] h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                                            <div className={`h-full ${isFullySent ? 'bg-green-500' : 'bg-primary'} transition-all duration-500`} style={{ width: `${progressPercent}%` }}></div>
                                        </div>
                                    </div>
                                    <div className={`${isFullySent ? 'text-green-600' : 'text-primary'} text-sm font-bold mt-1`}>{progressPercent}%</div>
                                </div>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className={`material-symbols-outlined text-[28px] ${isDone ? 'text-green-500' : 'text-[#9d4a48]/40 dark:text-gray-600'}`}>
                                        {isDone ? 'check_circle' : 'pending'}
                                    </span>
                                </div>
                                <div className="flex flex-1 items-start justify-between">
                                    <div>
                                        <p className={`text-base font-semibold ${isDone ? 'text-[#1c0d0d] dark:text-white' : 'text-[#1c0d0d]/40 dark:text-gray-500'}`}>Hearts Delivered</p>
                                        <p className={`${isDone ? 'text-green-600' : 'text-[#9d4a48]/40 dark:text-gray-600'} text-sm`}>
                                            {isDone ? 'Completed' : 'Pending completion'}
                                        </p>
                                    </div>
                                    <div className={`${isDone ? 'text-[#9d4a48]' : 'text-[#9d4a48]/40'} dark:text-gray-600 text-sm font-medium mt-1`}>
                                        {formatDateDisplay(order.DONE_TIME) || "--:--"}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Info Grids */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Order Summary */}
                        <div className="flex flex-col bg-white dark:bg-[#2d1616] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424] overflow-hidden">
                            <div className="p-4 border-b border-[#e9cfce] dark:border-[#3d2424] bg-gray-50 dark:bg-[#351a1a]">
                                <h3 className="font-bold text-[#1c0d0d] dark:text-white">Order Summary</h3>
                            </div>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-[#e9cfce] dark:border-[#3d2424]">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Item</span>
                                    <span className="text-[#1c0d0d] dark:text-white font-medium">{(order.AMOUNT || 0).toLocaleString()} Hearts</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-[#e9cfce] dark:border-[#3d2424]">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Price</span>
                                    <span className="text-[#1c0d0d] dark:text-white font-bold">{(order.MONEY || 0).toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Date</span>
                                    <span className="text-[#1c0d0d] dark:text-white font-medium">{formatDateDisplay(order.TIME_CREATE) || order.TIME_CREATE}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col bg-white dark:bg-[#2d1616] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424] overflow-hidden">
                            <div className="p-4 border-b border-[#e9cfce] dark:border-[#3d2424] bg-gray-50 dark:bg-[#351a1a]">
                                <h3 className="font-bold text-[#1c0d0d] dark:text-white">User Info</h3>
                            </div>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-[#e9cfce] dark:border-[#3d2424]">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Friend Code</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#1c0d0d] dark:text-white font-mono bg-gray-100 dark:bg-[#3d2424] px-2 py-1 rounded text-xs sm:text-sm truncate max-w-[150px]">{code}</span>
                                        <button className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors" title="Copy">content_copy</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-[#e9cfce] dark:border-[#3d2424]">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Note Status</span>
                                    <span className="text-[#1c0d0d] dark:text-white font-medium px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs">Placed</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-[#9d4a48] dark:text-gray-400 text-sm">Account Type</span>
                                    <span className="text-[#1c0d0d] dark:text-white font-medium">Global Version</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Grid - Copied from HTML structure */}
                    <div className="mt-8">
                        <h3 className="text-[#1c0d0d] dark:text-white text-lg font-bold px-4 mb-4">Need Help?</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#2d1616] hover:border-primary transition-all cursor-pointer">
                                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                    <span className="text-xs font-bold text-blue-600">FB</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Facebook</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#2d1616] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-[#5865F2]">forum</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Discord</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#2d1616] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-[#0088cc]">send</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Telegram</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#2d1616] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Email</span>
                            </a>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-10 text-center border-t border-[#e9cfce] dark:border-[#3d2424] mt-10">
                <p className="text-[#9d4a48] dark:text-gray-400 text-sm">© 2023 Heart of the Game. All rights reserved.</p>
            </footer>
        </div>
    );
}


