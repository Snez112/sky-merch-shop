"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import QRCodePayment from "@/components/qr-code-payment";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutSkeleton from "@/components/checkout/checkout-skeleton";
import PaymentForm from "@/components/checkout/payment-form";
import { securePost } from "@/lib/client/secure-fetch";
import OrderExpiredDialog from "@/components/order-expired-dialog";
import { ORDER_EXPIRY_MINUTES } from "@/lib/config";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get data from query params
    const codeParam = searchParams.get('code') || '';
    const amountParam = searchParams.get('amount') || '';
    const priceParam = searchParams.get('price') || '';
    
    const [friendCode, setFriendCode] = useState(codeParam);
    const [quantity, setQuantity] = useState(amountParam ? parseInt(amountParam) : 0);
    const [totalPrice, setTotalPrice] = useState(priceParam ? parseInt(priceParam) : 0);
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [verifySuccess, setVerifySuccess] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ORDER_EXPIRY_MINUTES * 60);
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);
    const [expiredMessage, setExpiredMessage] = useState("");
    const [orderCode, setOrderCode] = useState("");

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setShowExpiredDialog(true);
            setExpiredMessage("Your order has expired after 20 minutes. Please create a new order.");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleCreateOrder = async () => {
        if (!friendCode || !quantity) {
            setVerifyError("Please fill in all required fields");
            return;
        }

        setIsVerifying(true);
        setVerifyError("");

        try {
            // Create draft order
            const result = await securePost('/api/createDraftOrder', {
                code: friendCode,
                quantity: quantity,
                productPrice: Math.floor(totalPrice / quantity), // Price per heart
                productName: `Heart Pack (${quantity} hearts)`
            });

            if (result.success) {
                setOrderCode(friendCode); // Use the friend code as order code
                setShowQR(true);
            } else {
                setVerifyError(result.error || "Failed to create order");
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            setVerifyError(error.message || "Failed to create order");
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePaymentConfirm = async () => {
        if (!orderCode) return;
        
        setIsVerifying(true);
        setVerifyError("");

        try {
            const result = await securePost('/api/verifyPayment', {
                code: orderCode,
                amount: totalPrice
            });

            if (result.success) {
                setVerifySuccess(true);
                setTimeout(() => {
                    const params = new URLSearchParams({
                        code: orderCode,
                        amount: totalPrice.toString(),
                        hearts: quantity.toString()
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
        router.push('/');
    };

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
                                productName="Heart Pack" 
                                quantity={quantity}
                                amount={totalPrice}
                            />
                        </div>

                         <div className="lg:col-span-7 space-y-8">
                             <PaymentForm 
                                friendCode={friendCode}
                                onFriendCodeChange={setFriendCode}
                                isAgreed={isAgreed}
                                setIsAgreed={setIsAgreed}
                                onPayNow={handleCreateOrder}
                                disabled={timeLeft <= 0 || !friendCode || !quantity}
                                isCodeFromUrl={!!codeParam} // Check if code came from URL
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
                                totalPrice={totalPrice}
                                content={orderCode}
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
