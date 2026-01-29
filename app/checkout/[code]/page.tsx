"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ShoppingBag, CreditCard, CheckCircle2, Shield, Clock } from "lucide-react";
import QRCodePayment from "@/components/qr-code-payment";
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
    
    // Get payment data from session storage
    const [paymentData, setPaymentData] = useState<{
        code: string;
        amount: number;
        quantity: number;
        productName: string;
    } | null>(null);

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
                    router.push('/');
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
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0D0D1A] via-[#1a1a2e] to-[#0D0D1A] flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/20 border-t-cyan-500"></div>
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D1A] via-[#1a1a2e] to-[#0D0D1A] relative overflow-hidden">
            {/* Aurora Background Effects - Cyan/Purple theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="border-b border-white/10 backdrop-blur-xl bg-white/5">
                    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isVerifying || verifySuccess}
                            >
                                <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" />
                            </button>
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    Payment Checkout
                                </h1>
                                <p className="text-sm text-white/50 mt-1">{paymentData?.productName || 'N/A'}</p>
                            </div>
                            {/* Countdown Timer */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border ${
                                timeLeft < 300 ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
                            }`}>
                                <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400' : 'text-cyan-400'}`} />
                                <div className="text-right">
                                    <div className={`text-sm font-mono font-bold ${
                                        timeLeft < 300 ? 'text-red-400' : 'text-white'
                                    }`}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-white/50">Time left</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {!showQR ? (
                        <div className="space-y-6">
                            {/* Warning when less than 5 minutes */}
                            {timeLeft < 300 && timeLeft > 0 && (
                                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-300 mb-1">Hurry up!</h4>
                                            <p className="text-sm text-red-200/80">
                                                Your order will expire in less than 5 minutes. Please complete your payment soon.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Order Summary Card */}
                            <div className="relative group">
                                {/* Glow effect - subtle cyan */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-2xl opacity-40 group-hover:opacity-60 blur transition duration-500"></div>
                                
                                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
                                    
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30">
                                                <ShoppingBag className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-white">Order Summary</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white/60">Product</span>
                                                <span className="font-semibold text-white">{paymentData?.productName || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white/60">Quantity</span>
                                                <span className="font-semibold text-white">{paymentData?.quantity || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-white/60">Order Code</span>
                                                <code className="font-mono font-semibold text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-lg">
                                                    {paymentData?.code || code}
                                                </code>
                                            </div>
                                            <div className="flex justify-between items-center pt-4">
                                                <span className="text-lg font-semibold text-white">Total Amount</span>
                                                <div className="text-right">
                                                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                                        {(paymentData?.amount || 0).toLocaleString('vi-VN')}
                                                        <span className="ml-[0.3rem] text-2xl text-white/50">VNĐ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info Card */}
                            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/20">
                                        <Shield className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-2">Secure Payment</h3>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            Your payment is secured with bank-level encryption. Click the button below to proceed with QR code payment.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => setShowQR(true)}
                                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 p-[2px] transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl px-8 py-4 sm:py-5">
                                    <div className="flex items-center justify-center gap-3">
                                        <CreditCard className="w-6 h-6 text-white" />
                                        <span className="text-lg sm:text-xl font-bold text-white">
                                            Proceed to Payment
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <QRCodePayment
                                totalPrice={paymentData?.amount || 0}
                                content={paymentData?.code || code}
                                onClose={handleBack}
                                onPaymentConfirm={handlePaymentConfirm}
                                isVerifying={isVerifying}
                                verifyError={verifyError}
                                verifySuccess={verifySuccess}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Order Expired Dialog */}
            <OrderExpiredDialog isOpen={showExpiredDialog} message={expiredMessage} />
        </div>
    );
}
