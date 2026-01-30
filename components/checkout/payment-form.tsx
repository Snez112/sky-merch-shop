import React, { useState } from 'react';
import FaqDialog from '@/components/faq-dialog';

interface PaymentFormProps {
    friendCode: string;
    onFriendCodeChange: (code: string) => void;
    onPayNow: () => void;
    isAgreed: boolean;
    setIsAgreed: (agreed: boolean) => void;
    disabled?: boolean;
    isCodeFromUrl?: boolean; // Track if code was pre-filled from URL
}

export default function PaymentForm({ 
    friendCode, 
    onFriendCodeChange,
    onPayNow, 
    isAgreed, 
    setIsAgreed,
    disabled = false,
    isCodeFromUrl = false
}: PaymentFormProps) {
    const [showFaq, setShowFaq] = useState(false);
    return (
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-bold mb-8">Payment Details</h2>
            
            {/* Friend Code */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                    Confirm Friend Code
                    <span className="material-symbols-outlined text-sm text-gray-400" title="Find this in your Sky settings menu">info</span>
                </label>
                <input 
                    className={`w-full px-5 py-4 rounded-xl border-2 border-primary focus:ring-0 outline-none text-lg font-mono tracking-widest placeholder:text-gray-300 ${
                        isCodeFromUrl 
                            ? 'bg-primary/5 cursor-not-allowed' 
                            : 'bg-white dark:bg-background-dark focus:bg-white dark:focus:bg-background-dark'
                    }`}
                    placeholder="XXXX-XXXX-XXXX" 
                    type="text" 
                    value={friendCode}
                    onChange={(e) => !isCodeFromUrl && onFriendCodeChange(e.target.value)}
                    readOnly={isCodeFromUrl}
                />
                <p className="text-xs text-gray-500 mt-2 italic">Please double check your code to ensure heart delivery.</p>
            </div>

            {/* Checkbox */}
            <div className="mb-10 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input 
                            className="peer h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-accent focus:ring-accent transition-all cursor-pointer" 
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                        />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        I have read the <button type="button" onClick={() => setShowFaq(true)} className="text-primary hover:underline font-semibold">FAQ</button> and placed the candle note at the correct location as shown in the tutorial.
                    </span>
                </label>
            </div>

            {/* Payment Methods */}
            <div className="mb-10">
                <label className="block text-sm font-bold mb-4">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                    <label className="relative cursor-pointer group">
                        <input 
                            className="peer sr-only" 
                            name="payment" 
                            type="radio" 
                            defaultChecked 
                        />
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 peer-checked:border-primary peer-checked:bg-primary/10 transition-all flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">account_balance</span>
                            </div>
                            <span className="font-bold text-sm">Bank Transfer</span>
                            <span className="material-symbols-outlined ml-auto text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
                        </div>
                    </label>
                    <div className="relative group opacity-50 cursor-not-allowed">
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#ae2070]/20 rounded-lg flex items-center justify-center text-[#ae2070] font-bold text-xs grayscale">MoMo</div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-400">MoMo Wallet</span>
                                <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group opacity-50 cursor-not-allowed">
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#008fe5]/20 rounded-lg flex items-center justify-center text-[#008fe5] font-bold text-[10px] grayscale">ZaloPay</div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-400">ZaloPay</span>
                                <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group opacity-50 cursor-not-allowed">
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined">credit_card</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-400">Credit Card</span>
                                <span className="text-[9px] font-bold text-accent uppercase tracking-tighter">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <button 
                onClick={onPayNow}
                disabled={!isAgreed || disabled}
                className="w-full bg-[#f85956] hover:bg-[#e04d4a] py-5 rounded-full text-white font-bold text-xl shadow-lg shadow-accent/30 transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Pay Now
                <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-6 text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Secure SSL</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Verified Payment</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Instant Delivery</span>
                </div>
            </div>
            
            {/* FAQ Dialog */}
            <FaqDialog
                isOpen={showFaq}
                onClose={() => setShowFaq(false)}
                onAccept={() => setShowFaq(false)}
            />
        </div>
    );
}
