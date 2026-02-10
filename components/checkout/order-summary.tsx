import Image from "next/image";

interface OrderSummaryProps {
    productName: string;
    quantity: number;
    amount: number;
    originalPrice?: number; // Added field
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
    originalPrice,
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

    // Pack Name Logic: If standard pack, use specific formatting
    const displayProductName = quantity > 0 ? `${quantity} Hearts Pack` : productName;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Tóm Tắt Đơn Hàng</h2>
            
            {/* Product Card */}
            <div className="bg-[#0a1628] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden group border border-gray-800">
                 {/* Background decoration */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex gap-5 relative z-10 items-center">
                    <div className="size-24 bg-[#152033] rounded-2xl flex items-center justify-center border border-gray-700/50 shadow-inner shrink-0">
                         <Image 
                            src={productImage}
                            alt="Heart Pack" 
                            width={100}
                            height={100}
                            className="object-contain drop-shadow-lg "
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                        <p className="text-sm text-gray-400 font-medium mb-1">Gói Dịch Vụ</p>
                        <h3 className="text-xl font-bold tracking-tight text-white">{displayProductName}</h3>
                        <div className="mt-2 text-left">
                            <p className="text-2xl font-bold text-[#ff5b5b] leading-none">
                                {amount.toLocaleString('vi-VN')}đ
                            </p>
                            {originalPrice && originalPrice > amount && (
                                <p className="text-sm text-gray-500 line-through font-medium mt-1">
                                    {originalPrice.toLocaleString('vi-VN')}đ
                                </p>
                            )}
                        </div>
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
