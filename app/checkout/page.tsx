"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { getCookie, setCookie } from "@/lib/client/cookie-utils";
import QRCodePayment from "@/components/qr-code-payment";
import OrderSummary from "@/components/checkout/order-summary";
import CheckoutSkeleton from "@/components/checkout/checkout-skeleton";
import PaymentForm from "@/components/checkout/payment-form";
import { verifyPayment } from "@/services/order/verify-payment";
import OrderExpiredDialog from "@/components/order-expired-dialog";
import { ORDER_EXPIRY_MINUTES } from "@/lib/config";
import { ArrowLeft, Heart, Clock, ChevronRight, Sun, Moon } from "@/components/icons";
import { encryptData, decryptData } from "@/lib/client/encryption";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import { useRef } from "react";
import { useCouponValidation } from "@/lib/hooks/useCouponValidation";
import { calculateBestPrice, calculateTieredPrice } from "@/lib/pricing-helpers";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get data from query params
    const codeParam = searchParams.get('code') || '';
    const amountParam = searchParams.get('amount') || '';
    const priceParam = searchParams.get('price') || '';
    const couponParam = searchParams.get('coupon') || '';
    
    const [friendCode, setFriendCode] = useState(codeParam);
    const [quantity, setQuantity] = useState(amountParam ? parseInt(amountParam) : 0);
    const [couponCode, setCouponCode] = useState(couponParam);

    // Use validation hook to get discount info
    const { 
        couponData, 
        couponError, 
        isValidating: isCouponValidating 
    } = useCouponValidation(couponCode);

    // Clear URL params after loading data
    useEffect(() => {
        if (codeParam || amountParam || priceParam || couponParam) {
            // Use replaceState to clear params without refresh or server roundtrip
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [codeParam, amountParam, priceParam, couponParam]);

    // Load quantity and code from cookie if no params
    useEffect(() => {
        if (!amountParam && !priceParam) {
            // Check for checkout data from cookie
            try {
                const sessionData = getCookie('checkoutData', false); // Get raw string
                if (sessionData) {
                    const parsed = decryptData(sessionData as string);
                    
                    if (parsed) {
                        if (parsed.code) setFriendCode(parsed.code);
                        if (parsed.quantity) {
                             setQuantity(parsed.quantity);
                        }
                        if (parsed.coupon) {
                            setCouponCode(parsed.coupon);
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing cookie", e);
            }
            
            // If we still don't have quantity/code after checking cookie, redirect home
            const sessionData = getCookie('checkoutData', false);
            if (!sessionData) {
                router.push('/');
            }
        }
    }, [amountParam, priceParam, router]);

    // Fetch price from server using SWR (always fetch to support coupon recalculation)
    const shouldFetchPrice = quantity > 0;
    const { data: priceData, error: priceError, isLoading: isPriceLoading } = useSWR(
        shouldFetchPrice ? `/api/pricing?quantity=${quantity}` : null,
        fetcher
    );

    // Derive base price data
    const pricePerHeart = priceData?.pricePerHeart || 3000;
    const sheetAmount = priceData?.sheetAmount || 0; // Need to ensure API returns this
    
    // Calculate final total price using Best Price Logic
    // If we have coupon data, compare it with system multiplier
    let finalTotalPrice = priceParam ? parseInt(priceParam) : (priceData?.price || 0);
    let isCouponApplied = false;

    // Tiered price WITHOUT coupon (used to show base price row)
    const tieredPrice = priceData
        ? calculateTieredPrice(quantity, pricePerHeart, sheetAmount)
        : (priceParam ? parseInt(priceParam) : 0);

    // If we have priceData (meaning we fetched fresh pricing), we can recalculate accurately
    if (priceData && couponData) {
        const bestPrice = calculateBestPrice(
            quantity,
            pricePerHeart,
            sheetAmount,
            couponData.discount
        );
        finalTotalPrice = bestPrice.price;
        isCouponApplied = bestPrice.isCouponApplied;
    } else if (!priceData && priceParam && couponData) {
        // Fallback if we only have params: we can't accurately compare multipliers without sheetAmount
        // But checkout page fetches priceData anyway.
        // If priceData is loading, we might show passed param.
        // Ideally we wait for priceData to apply coupon logic correctly.
    }

    // Handle fetch errors
    useEffect(() => {
        if (priceError) {
            console.error('Failed to fetch price:', priceError);
            setVerifyError('Failed to load price. Please refresh.');
        }
    }, [priceError]);
    
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
            // Skip creating draft order, just show QR
            // The order will be created in Google Sheet after payment verification
            setOrderCode(friendCode); 
            setShowQR(true);
        } catch (error: any) {
            console.error('Error creating order:', error);
            setVerifyError(error.message || "Failed to create order");
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePaymentConfirm = async (isAutoCheck = false) => {
        if (!orderCode) return;
        
        setIsVerifying(true);
        if (!isAutoCheck) {
            setVerifyError("");
        }

        try {
            const result = await verifyPayment({
                code: orderCode,
                quantity: quantity,
                coupon: couponCode,
                discount: couponData?.discount,
                isCouponApplied: isCouponApplied,
            });
            
            console.log(result);
            
            if (result.success) {
                setVerifySuccess(true);
                setTimeout(() => {
                    // Save encrypted code and quantity
                    const encryptedData = encryptData({
                        code: orderCode,
                        hearts: quantity
                    });
                    
                    setCookie('successData', encryptedData, { path: '/', expires: 60 });
                    
                    router.push('/checkout/success');
                }, 2000);
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            
            // Don't show error for auto-check if it's just "not found"
            if (isAutoCheck && error.message?.includes("No transaction found")) {
                return;
            }
            
            setVerifyError(error.message || "Failed to create order");
        } finally {
            setIsVerifying(false);
        }
    };


    const handleBack = () => {
        router.push('/');
    };

    if (isPriceLoading && !priceParam) {
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
                        <ArrowLeft className="w-4 h-4" />
                        Back to Store
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary fill-primary" />
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
                                <Sun className="w-4 h-4 text-yellow-500" />
                            ) : (
                                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    )}

                     {/* Timer Badge */}
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                        timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 dark:bg-gray-800 border-transparent'
                     }`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-mono font-bold">
                             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-10">
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 dark:text-gray-400">
                    <a href="/" className="hover:text-primary">Store</a>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#0e171b] dark:text-white font-medium">Checkout</span>
                </div>

                {!showQR ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                         {/* Left Column: Order Summary */}
                    {/* Left Column: Order Summary */}
                        <div className="lg:col-span-5">
                            <OrderSummary 
                                productName={`${quantity} Hearts Pack`}
                                quantity={quantity}
                                amount={finalTotalPrice}
                                basePrice={tieredPrice}
                                originalPrice={Math.ceil(((quantity * pricePerHeart) / 3) / 100) * 100}
                                couponCode={couponCode}
                                onCouponCodeChange={setCouponCode}
                                couponData={couponData}
                                couponError={couponError}
                                isValidating={isCouponValidating}
                            />
                        </div>

                         <div className="lg:col-span-7 space-y-8">
                             <PaymentForm 
                                friendCode={friendCode}
                                onFriendCodeChange={setFriendCode}
                                onPayNow={handleCreateOrder}
                                isAgreed={isAgreed}
                                setIsAgreed={setIsAgreed}
                                disabled={isVerifying || isCouponValidating}
                                isCodeFromUrl={!!codeParam}
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
                                totalPrice={finalTotalPrice}
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
                            <ArrowLeft className="w-4 h-4" />
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
