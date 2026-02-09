import Link from "next/link";
import FastBuyCard from "@/components/shop/fast-buy-card";
import { Zap } from "@/components/icons";

export default function HeroSection() {
    return (
        <section className="py-12 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary w-fit">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">FAST & SECURE DELIVERY</span>
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                    Nâng cấp <br /> <span className="text-primary">trải nghiệm Sky của bạn.</span>
                </h1>
                <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-lg">
                    Cách an toàn và nhanh nhất để nhận Tim cho Sky: Children of the Light.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#products" className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all text-center text-sm sm:text-base">
                        Xem Các Gói
                    </Link>
                    <Link href="#how-it-works" className="px-6 sm:px-8 py-3 sm:py-4 bg-background-light dark:bg-background-dark border-2 border-primary/20 font-bold rounded-full hover:bg-primary/5 transition-all text-center text-sm sm:text-base">
                        Cách hoạt động
                    </Link>
                </div>
            </div>
            
            {/* Fast Buy Card Component */}
            <FastBuyCard />
        </section>
    );
}
