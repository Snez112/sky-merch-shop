"use client";

import { useState } from "react";
import BuyModal from "../product-section/buy-modal";
import Image from "next/image";

export default function HeartPacks() {
    const [selectedPack, setSelectedPack] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const packs = [
        {
            id: "starter",
            name: "30 Hearts Pack",
            hearts: 30,
            priceNum: 10000,
            price: "10,000đ",
            oldPrice: "11,000đ",
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOaDSVrPrgC9HRHJWUBPH_RGvyRT20vBA87qGfMRFm5BFYZ_pQJxlhjV3kJeNdh6MrTvnG7LnmNwf_KzMwsXDWsyDTTb4ZMuSGxk0BBOVuDAnY1KfayGr0zyVwhOgvls4rsfUiqUvTSHqMqT4EOgtGLmqidjFESkzzhNE3MTfmGv4fDJaUEJs0Tzv6saDzlG_NiIVY5gTNdLYqDX297OajuFJcmabxpje4umkxhdgEse6mSHtEvVhHKLyWTekxacLs0UsBRcMmFls",
            tag: "Starter",
            category: "Starter Pack"
        },
        {
            id: "popular",
            name: "100 Hearts Pack",
            hearts: 100,
            priceNum: 30000,
            price: "30,000đ",
            oldPrice: "35,000đ",
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwQ5EFQUyjdhMURYLZ8mQX2cAPwB7o2I-ffokJLOd-4-Ze76DTWUFyIQLeeQJfr9K2zqaY77-KqKd0HUgC6pveiBQaUr7SLPhI45GUn8UfPLhIiq6UFaiMJhx2tA-HpiMfnnb0tVFvUebvUxgt4_7cVgzpwjsoHDpafDNoEnp30Lib_k63xhKv42a6vw1152i5WYmCMz223me5LRJBaeYfBUeGkJHKgo9BldF4BpAyPolRXxHI-LBoMB86p9-oOaN0F6r__wDkjBE",
            tag: "POPULAR",
            isPopular: true,
            category: "Popular Pack"
        },
        {
            id: "standard",
            name: "170 Hearts Pack",
            hearts: 170,
            priceNum: 50000,
            price: "50,000đ",
            oldPrice: "63,000đ",
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIHZPOPluZovRodtYx7O2fPaqhpgh9m3dqMjinOGY8b5UsahGfST7tnXNTTpnBQEI_8LpmyNUyAS-O16AHBfOjCQyTOAkL2tMmOtc5XFx_LUPq8_a15MaKd5BFL6lCzMiPZA1kSJ-NZAOJfw5Xv4By9cVQwQK3vuK8QN77zm9exCr7BSS2aniIzF1-1hqPhZQsEit5aTqPALR2TA5uTmodtSIVfdudlxpi9BGYIOlLCaKqy0GAVe3AZuOMvVuvcAq55EwZSS2f-gs",
            category: "Standard Pack"
        },
        {
            id: "value",
            name: "360 Hearts Pack",
            hearts: 360,
            priceNum: 100000,
            price: "100,000đ",
            oldPrice: "130,000đ",
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuIUNxThKY85Sd4FocTUIv-JY1ifZ9EN3C8iRM7SpFx-iqK_QpIlM19VIgXZsbWQJIzwE-1qjUvx5bPzr7IN5n4hgVcr4jE4iti6e6WrFrHthpcj-T7A0t_5rfq0yhmbX-YLbSWATXZdiv2qf95TVlUzi2xFdtEOY1wVJuBuM2aUV9k0_J1YQsgzp3jUSJbGwpR0tJDy6f0UuD5vuINfIUz0KTtgkub_r9TUgIuOuWlJyrfvt6SKo_n36Zaeo30jBN_3m-K3lvWmA",
            tag: "BEST VALUE",
            isBestValue: true,
            category: "Best Value"
        }
    ];

    const handleBuyClick = (pack: any) => {
        setSelectedPack({
            id: pack.id,
            name: pack.name,
            hearts: pack.hearts,
            price: pack.priceNum,
            category: pack.category
        });
        setIsModalOpen(true);
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

            {selectedPack && (
                <BuyModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedPack}
                />
            )}
        </section>
    );
}
