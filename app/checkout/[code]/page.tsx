"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import QRCodePayment from "@/components/qr-code-payment";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutSkeleton from "@/components/checkout/checkout-skeleton";
import PaymentForm from "@/components/checkout/payment-form";
import { securePost } from "@/lib/client/secure-fetch";
import { getCookie, deleteCookie } from "@/lib/client/cookie-utils";
import OrderExpiredDialog from "@/components/order-expired-dialog";
import { ORDER_STATUS } from "@/types/order";
import { ORDER_EXPIRY_MINUTES } from "@/lib/config";

export default function CheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const code = params.code as string;
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [verifySuccess, setVerifySuccess] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ORDER_EXPIRY_MINUTES * 60); // Convert to seconds
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);
    const [expiredMessage, setExpiredMessage] = useState("");

    const [isCheckingStatus, setIsCheckingStatus] = useState(true); // Prevent premature redirect
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Get payment data from session storage
    const [paymentData, setPaymentData] = useState<{
        code: string;
        amount: number;
        quantity: number;
        productName: string;
    } | null>(null);

    const [isAgreed, setIsAgreed] = useState(false);

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setShowExpiredDialog(true);
            setExpiredMessage("Your order has expired after 20 minutes. Please create a new order.");
            deleteCookie('checkoutData');
            sessionStorage.removeItem('checkoutData');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Check order status on mount
    useEffect(() => {
        const checkOrderStatus = async () => {
            if (!code) {
                setIsCheckingStatus(false);
                return;
            }

            try {
                // Call API to check if order is still valid
                const result = await securePost('/api/checkOrderStatus', { code });
                console.log("result",result);
                if (result.status === ORDER_STATUS.REMOVED || result.status === ORDER_STATUS.EXPIRED) {
                    setShowExpiredDialog(true);
                    setExpiredMessage(
                        result.message || 
                        "This order code has expired or been removed. Please create a new order."
                    );
                    deleteCookie('checkoutData');
                    sessionStorage.removeItem('checkoutData');
                } else if (result.remainingSeconds !== undefined) {
                    // Set timer to actual remaining time from server
                    setTimeLeft(result.remainingSeconds);
                    
                    // If we have data but no local paymentData (direct access), restore it
                    if (result.data && !paymentData) {
                        setPaymentData({
                            code: result.data.CODE || code,
                            amount: result.data.MONEY || 0,
                            quantity: result.data.AMOUNT || 0,
                            productName: "Heart Pack" // Default name since we don't store it in sheet yet
                        });
                        
                        // Also restore to session storage to persist across reloads
                        const restoredData = {
                            code: result.data.CODE || code,
                            amount: result.data.MONEY || 0,
                            quantity: result.data.AMOUNT || 0,
                            productName: "Heart Pack"
                        };
                        sessionStorage.setItem('checkoutData', JSON.stringify(restoredData));
                    }

                    // If time already expired, show dialog
                    if (result.remainingSeconds <= 0) {
                        setShowExpiredDialog(true);
                        setExpiredMessage("Your order has expired after 20 minutes. Please create a new order.");
                        deleteCookie('checkoutData');
                        sessionStorage.removeItem('checkoutData');
                    }
                }
            } catch (error) {
                console.error('Error checking order status:', error);
                // Show error to user
                setShowExpiredDialog(true);
                setExpiredMessage("Failed to check order status. Please refresh the page or try again later.");
            } finally {
                setIsCheckingStatus(false); // Done checking
            }
        };

        checkOrderStatus();
    }, [code]);

    useEffect(() => {
        // Wait for status check to complete before redirecting
        if (isCheckingStatus) return;
        
        // Try to get data from session storage
        let storedData = sessionStorage.getItem('checkoutData');
        
        // If no sessionStorage, try cookie
        if (!storedData) {
            const cookieData = getCookie<{
                code: string;
                amount: number;
                quantity: number;
                productName: string;
            }>('checkoutData');
            
            if (cookieData) {
                storedData = JSON.stringify(cookieData);
            }
        }
        
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                // Use code from URL params
                if (code) {
                    data.code = decodeURIComponent(code);
                }
                setPaymentData(data);
                
                // Sync to sessionStorage if it came from cookie
                if (!sessionStorage.getItem('checkoutData')) {
                    sessionStorage.setItem('checkoutData', storedData);
                }
            } catch (error) {
                console.error('Failed to parse checkout data:', error);
                router.push('/');
            }
        } else {
            // No data found, redirect back (only if not showing expired dialog)
            if (!showExpiredDialog) {
                router.push('/');
            }
        }
    }, [router, code, isCheckingStatus, showExpiredDialog]);

    const handlePaymentConfirm = async () => {
        if (!paymentData) return;
        
        setIsVerifying(true);
        setVerifyError("");

        try {
            const result = await securePost('/api/verifyPayment', {
                code: paymentData.code,
                amount: paymentData.amount
            });

            if (result.success) {
                setVerifySuccess(true);
                // Clear session storage and cookie
                sessionStorage.removeItem('checkoutData');
                deleteCookie('checkoutData');
                // Redirect to success page after 2 seconds
                setTimeout(() => {
                    const params = new URLSearchParams({
                        code: paymentData.code,
                        amount: paymentData.amount.toString(),
                        hearts: paymentData.quantity.toString()
                    });
                    router.push(`/checkout/success?${params.toString()}`);
                }, 2000);
            } else {
                setVerifyError(result.error || "Payment verification failed. Please try again.");
            }
        } catch (error: any) {
            console.error('Error verifying payment:', error);
            setVerifyError(error.message || "Failed to verify payment. Please check your connection and try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleBack = () => {
        // Clear session storage, cookie and go back
        sessionStorage.removeItem('checkoutData');
        deleteCookie('checkoutData');
        router.back();
    };

    if (!paymentData && !showExpiredDialog) {
        return <CheckoutSkeleton />;
    }







    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0e171b] dark:text-white min-h-screen font-display">
             {/* Header */}
             <header className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Store
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Heart of the Game</h1>
                </div>
                <div className="flex items-center gap-4 justify-end">
                    {/* Dark Mode Toggle */}
                    {mounted && (
                         <button 
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <span className="material-symbols-outlined text-yellow-500 text-sm">light_mode</span>
                            ) : (
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-sm">dark_mode</span>
                            )}
                        </button>
                    )}

                     {/* Timer Badge */}
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                        timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 dark:bg-gray-800 border-transparent'
                     }`}>
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="text-sm font-mono font-bold">
                             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-10">
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 dark:text-gray-400">
                    <a href="/" className="hover:text-primary">Store</a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-[#0e171b] dark:text-white font-medium">Checkout</span>
                </div>

                {!showQR ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                         {/* Left Column: Order Summary */}
                        <div className="lg:col-span-5">
                            <OrderSummary 
                                productName={paymentData?.productName || "Heart Pack"} 
                                quantity={paymentData?.quantity || 0}
                                amount={paymentData?.amount || 0}
                            />
                        </div>

                        {/* Right Column: Payment Details */}
                        <div className="lg:col-span-7 space-y-8">
                             <PaymentForm 
                                friendCode={paymentData?.code || code}
                                onFriendCodeChange={() => {}} // Read only
                                isAgreed={isAgreed}
                                setIsAgreed={setIsAgreed}
                                onPayNow={() => setShowQR(true)}
                                disabled={timeLeft <= 0}
                             />
                             <p className="text-center text-xs text-gray-400">
                                By clicking "Pay Now", you agree to our Terms of Service and Refund Policy.
                                Hearts are usually delivered within 5-15 minutes of successful payment.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
                            <QRCodePayment
                                totalPrice={paymentData?.amount || 0}
                                content={paymentData?.code || code}
                                onClose={() => setShowQR(false)} 
                                onPaymentConfirm={handlePaymentConfirm}
                                isVerifying={isVerifying}
                                verifyError={verifyError}
                                verifySuccess={verifySuccess}
                            />
                        </div>
                         <button 
                            onClick={() => setShowQR(false)}
                            className="w-full mt-4 text-sm text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Change Payment Method
                        </button>
                    </div>
                )}
            </main>
            
            <OrderExpiredDialog isOpen={showExpiredDialog} message={expiredMessage} />
            <footer className="py-12"></footer>
        </div>
    );
}
