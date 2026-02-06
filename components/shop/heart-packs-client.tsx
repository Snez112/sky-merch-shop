"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { setCookie } from "@/lib/client/cookie-utils";
import { encryptData } from "@/lib/client/encryption";

interface Pack {
    id: string;
    name: string;
    hearts: number;
    priceNum: number;
    price: string;
    oldPrice: string;
    bgImage: string;
    tag?: string;
    isPopular?: boolean;
    isBestValue?: boolean;
    category: string;
}

interface HeartPacksClientProps {
    packs: Pack[];
}

export default function HeartPacksClient({ packs }: HeartPacksClientProps) {
    const router = useRouter();

    const handleBuyClick = (pack: Pack) => {
        // Save only quantity to cookie - price will be fetched from server
        // Encrypt data before saving to cookie
        const encryptedData = encryptData({
             quantity: pack.hearts
        });
        
        setCookie('checkoutData', encryptedData, { path: '/', expires: 60 });
        router.push('/checkout');
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 border-t border-primary/5" id="products">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">Các Gói Tim Thông Dụng</h2>
                <p className="text-sm sm:text-base opacity-60">Chọn gói phù hợp để hoàn thiện trải nghiệm game của bạn</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {packs.map((pack, index) => {
                    // Determine border color based on pack type
                    let borderColor = 'border-primary/10 hover:border-primary';
                    if (pack.id === 'starter') borderColor = 'border-blue-500/10 hover:border-blue-500';
                    if (pack.id === 'popular') borderColor = 'border-primary/10 hover:border-primary';
                    if (pack.id === 'standard') borderColor = 'border-purple-500/10 hover:border-purple-500';
                    if (pack.id === 'value') borderColor = 'border-2 border-yellow-400';
                    
                    return (
                        <div 
                            key={index} 
                            className={`group bg-white dark:bg-card-dark p-4 sm:p-6 rounded-xl border ${borderColor} transition-all hover:-translate-y-2 hover:bg-primary/5 dark:hover:bg-primary/10 relative ${pack.isBestValue ? 'shadow-xl shadow-primary/10' : ''}`}
                        >
                            {pack.tag && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${
                                    pack.id === 'starter' ? 'bg-blue-500' :
                                    pack.isPopular ? 'bg-primary' :
                                    pack.id === 'standard' ? 'bg-purple-500' :
                                    pack.isBestValue ? 'bg-yellow-400 text-[#1c0d0d] font-black' : 'bg-primary'
                                } text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg z-10`}>
                                    {pack.tag}
                                </div>
                            )}
                            
                            <div className={`w-full aspect-square ${pack.isBestValue ? 'bg-primary/10' : 'bg-primary/5'} rounded-lg mb-6 flex items-center justify-center relative overflow-hidden`}>
                                <div className="relative w-full h-full p-4">
                                    <Image
                                        src={`/pack-${pack.hearts}.png`}
                                        alt={`${pack.hearts} Hearts`}
                                        fill
                                        className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority={index === 0}
                                    />
                                </div>
                            </div>
                            
                            <h4 className="text-lg sm:text-xl font-black mb-1">{pack.hearts} ❤️</h4>
                            <p className="text-2xl font-black text-primary mb-1">{pack.price}</p>
                            <p className="text-sm line-through opacity-40 mb-4 font-medium">{pack.oldPrice}</p>
                            
                            <button 
                                onClick={() => handleBuyClick(pack)}
                                className="w-full py-3 bg-transparent text-white border-2 border-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                                Mua Ngay
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
