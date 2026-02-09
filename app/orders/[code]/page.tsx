"use client";

import { useParams, useRouter } from "next/navigation";
import TrackingSkeleton from "@/components/skeletons/tracking-skeleton";
import { ORDER_STATUS } from "@/types/order";
import { formatDateTime } from "@/lib/utils/date";
import { checkOrderStatus } from "@/services/order/check-order-status";
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

        // Fetch order status using service
        const orderResult = await checkOrderStatus({ code });
        // Check order status
        if (orderResult.status === ORDER_STATUS.NOT_FOUND) {
            throw new Error("Order not found. Please check your code and try again.");
        }
        
        return {
            order: orderResult.data,
            verifyingDetails: null, // Bank data no longer exposed to client
            hasCheckedBank: false
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
                <div className="bg-white dark:bg-[#0a1628] p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 text-center max-w-md w-full">
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

    // Null check for order
    if (!order) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-6 transition-colors">
                <div className="bg-white dark:bg-[#0a1628] p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 text-center max-w-md w-full">
                    <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1c0d0d] dark:text-white mb-2">Order Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find an order with this code.</p>
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

    // Status Logic - based on order data only
    const status = order.ORDER_STATUS ? order.ORDER_STATUS.toLowerCase() : "";
    const isPaid = status !== "pending" && status !== "created";
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
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-[#0a1628] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424]">
                        <div>
                            <p className="text-[#1c0d0d] dark:text-white text-3xl font-black leading-tight tracking-tight">Order #{code.toUpperCase()}</p>
                            <p className="text-[#9d4a48] dark:text-gray-400 text-sm mt-1">Status: Tracking Details</p>
                        </div>
                        <div className={`flex min-w-[120px] items-center justify-center overflow-hidden rounded-full h-10 px-6 border-2 text-sm font-bold tracking-wide capitalize
                            ${status === 'done' || status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500' : 
                              status === 'removed' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-500' :
                              status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-500' :
                              isPaid ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-500' :
                              'bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-400 border-gray-500'}
                        `}>
                            {order.ORDER_STATUS || "Unknown"}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-8 bg-white dark:bg-[#0a1628] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424]">
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
                                        <p className={`${isPaid ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} text-sm`}>
                                            {isPaid ? 'Verified' : 'Pending'}
                                        </p>
                                        {isPaid && order.BANK_CODE && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Bank: <span className="font-mono font-bold text-[#1c0d0d] dark:text-gray-300">
                                                    {order.BANK_CODE}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-[#9d4a48] dark:text-gray-400 text-sm font-medium mt-1">
                                        {formatDateDisplay(order.BANK_TIME)}
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
                        <div className="flex flex-col bg-white dark:bg-[#0a1628] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424] overflow-hidden">
                            <div className="p-4 border-b border-[#e9cfce] dark:border-[#3d2424] bg-gray-50 dark:bg-[#151c3b]">
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
                        <div className="flex flex-col bg-white dark:bg-[#0a1628] rounded-lg shadow-sm border border-[#e9cfce] dark:border-[#3d2424] overflow-hidden">
                            <div className="p-4 border-b border-[#e9cfce] dark:border-[#3d2424] bg-gray-50 dark:bg-[#151c3b]">
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
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#0a1628] hover:border-primary transition-all cursor-pointer">
                                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                    <span className="text-xs font-bold text-blue-600">FB</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Facebook</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#0a1628] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-[#5865F2]">forum</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Discord</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#0a1628] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-[#0088cc]">send</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Telegram</span>
                            </a>
                            <a className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e9cfce] dark:border-[#3d2424] bg-white dark:bg-[#0a1628] hover:border-primary transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1c0d0d] dark:text-white">Email</span>
                            </a>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}


