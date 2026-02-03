"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { setCookie } from "@/lib/client/cookie-utils";

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
        setCookie('checkoutData', {
            quantity: pack.hearts
        }, { path: '/', expires: 60 });
        router.push('/checkout');
    };

    return (
        <section className="py-20 border-t border-primary/5" id="products">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4">Specialized Heart Packs</h2>
                <p className="opacity-60">Choose the perfect pack for your constellation progress</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packs.map((pack, index) => (
                    <div 
                        key={index} 
                        className={`group bg-white dark:bg-[#2d1818] p-6 rounded-xl border ${pack.isBestValue ? 'border-2 border-primary shadow-xl shadow-primary/10' : 'border-primary/10'} hover:border-primary transition-all hover:-translate-y-2 relative text-foreground`}
                    >
                        {pack.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg z-10">POPULAR</div>
                        )}
                        {pack.isBestValue && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#1c0d0d] text-[10px] font-black px-4 py-1 rounded-full shadow-lg z-10">BEST VALUE</div>
                        )}
                        
                        <div className={`w-full aspect-square ${pack.isBestValue ? 'bg-primary/10' : 'bg-primary/5'} rounded-lg mb-6 flex items-center justify-center relative overflow-hidden`}>
                             <div className="relative w-full h-full p-4">
                                <Image
                                    src="/heart-sky.png"
                                    alt={`${pack.hearts} Hearts`}
                                    fill
                                    className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    priority={index === 0}
                                />
                             </div>
                            
                            {pack.tag && !pack.isPopular && !pack.isBestValue && (
                                <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10">{pack.tag}</div>
                            )}
                        </div>
                        
                        <h4 className="text-xl font-black mb-1">{pack.hearts} Hearts</h4>
                        <p className="text-2xl font-black text-primary mb-1">{pack.price}</p>
                        <p className="text-sm line-through opacity-40 mb-4 font-medium italic">Was {pack.oldPrice}</p>
                        
                        <button 
                            onClick={() => handleBuyClick(pack)}
                            className={`w-full py-3 ${pack.isBestValue ? 'bg-primary text-white hover:shadow-lg' : pack.isPopular ? 'bg-secondary text-primary hover:shadow-lg' : 'bg-secondary/30 text-primary hover:bg-secondary'} font-bold rounded-full transition-all`}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
