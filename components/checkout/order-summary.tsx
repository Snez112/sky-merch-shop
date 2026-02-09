import Image from "next/image";

interface OrderSummaryProps {
    productName: string;
    quantity: number;
    amount: number;
    // New coupon props
    couponCode: string;
    onCouponCodeChange: (code: string) => void;
    couponData: any;
    couponError: string;
    isValidating: boolean;
}

export default function OrderSummary({ 
    productName, 
    quantity, 
    amount,
    couponCode,
    onCouponCodeChange,
    couponData,
    couponError,
    isValidating
}: OrderSummaryProps) {
    // Determine product image based on quantity
    const standardPacks = [30, 100, 170, 360];
    const productImage = standardPacks.includes(quantity) 
        ? `/pack-${quantity}.png` 
        : '/heart-sky.png';

    // Calculate discount amount for display
    // If couponData exists, the 'amount' passed in is already discounted.
    // We need to back-calculate or just use the difference if available.
    // Actually, CheckoutPage calculates finalTotalPrice. 
    // To show the discount breakdown, we should ideally receive originalPrice too, 
    // but we can infer or simpler: just show the discount percentage/multiplier.
    
    // For now, let's just show the coupon status and the final price.
    // If we want to show "-X đ", we need original price. 
    // Let's assume 'amount' is final price.

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Tóm Tắt Đơn Hàng</h2>
            
            {/* Product Card */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="flex gap-4 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl flex items-center justify-center overflow-hidden border border-primary/10 relative">
                         <Image 
                            src={productImage}
                            alt="Heart Pack" 
                            fill
                            className="object-cover p-2 group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gói Dịch Vụ</p>
                        <h3 className="text-lg font-bold">{productName || "Pack Heart"}</h3>
                        <p className="text-lg font-bold text-primary mt-1">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400">Tạm tính ({quantity} Hearts)</p>
                        <p className="font-medium">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                    
                    {couponData && (
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <p className="text-gray-500 dark:text-gray-400">Mã khuyến mãi</p>
                            <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">{couponData.code}</span>
                        </div>
                        <p className="font-medium text-green-500">Giảm {couponData.discount}x</p>
                    </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <p className="text-lg font-bold">Tổng cộng</p>
                        <p className="text-2xl font-bold text-[#0e171b] dark:text-white">{amount.toLocaleString('vi-VN')}đ</p>
                    </div>
                </div>
            </div>

            {/* Promo Input */}
            <div className="space-y-2">
                <div className="flex gap-2 relative">
                    <input 
                        className={`flex-1 px-4 py-3 rounded-full border bg-transparent focus:ring-2 outline-none text-sm ${
                            couponError 
                                ? 'border-red-500 focus:ring-red-500/20' 
                                : couponData 
                                ? 'border-green-500 focus:ring-green-500/20' 
                                : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'
                        }`} 
                        placeholder="Mã giảm giá" 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase().trim())}
                    />
                    <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={isValidating}>
                        {isValidating ? "..." : "Áp Dụng"}
                    </button>
                    {isValidating && (
                        <div className="absolute right-24 top-1/2 -translate-y-1/2">
                            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                {couponError && (
                    <p className="text-xs text-red-500 font-medium ml-2">{couponError}</p>
                )}
                {couponData && (
                    <p className="text-xs text-green-500 font-medium ml-2">✅ Mã hợp lệ! Đã áp dụng ưu đãi.</p>
                )}
            </div>
        </div>
    );
}
