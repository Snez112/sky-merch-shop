import Image from "next/image";

interface OrderSummaryProps {
    productName: string;
    quantity: number;
    amount: number;
    promoCode?: string;
}

export default function OrderSummary({ 
    productName, 
    quantity, 
    amount,
    promoCode = "TET2026" 
}: OrderSummaryProps) {
    // ... (logic comment same)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            {/* Product Card */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="flex gap-4 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl flex items-center justify-center overflow-hidden border border-primary/10 relative">
                         <Image 
                            src="/heart-sky.png" 
                            alt="Heart Pack" 
                            fill
                            className="object-cover p-2 group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Digital Pack</p>
                        <h3 className="text-lg font-bold">{productName || "360 Hearts Pack"}</h3>
                        <p className="text-lg font-bold text-primary mt-1">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400">Subtotal ({quantity} Hearts)</p>
                        {/* Assuming subtotal is higher? Or just show same amount? 
                            To be safe and "not break logic", we display the final amount.
                            If we want to show 'fake' discounts like the UI, we need to know the 'original' price.
                            For now, let's keep it simple: Show the key info.
                        */}
                        <p className="font-medium">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                    
                    {/* Only show these if we actually have this logic. 
                        User said "Apply new CSS", but logic must be correct.
                        If we hardcode discounts, it might be wrong for other products.
                        I will hide the hardcoded discounts for now to ensure ACCURACY,
                        unless we want to hardcode them for visual matching.
                        Let's show the promo code row if a code is present (visual only).
                    */}
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <p className="text-gray-500 dark:text-gray-400">Promo Code Discount</p>
                            <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">{promoCode}</span>
                        </div>
                        <p className="font-medium text-accent">-0đ</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <p className="text-lg font-bold">Total</p>
                        <p className="text-2xl font-bold text-[#0e171b] dark:text-white">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>

            {/* Promo Input */}
            <div className="flex gap-2">
                <input 
                    className="flex-1 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary outline-none text-sm" 
                    placeholder="Promo code" 
                    type="text" 
                    defaultValue={promoCode}
                />
                <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                    Apply
                </button>
            </div>
        </div>
    );
}
