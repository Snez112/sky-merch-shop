import Link from "next/link";
import FastBuyCard from "@/components/shop/fast-buy-card";

export default function HeroSection() {
    return (
        <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary w-fit">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Fast & Secure Delivery</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Light up your <br /> <span className="text-primary">journey in Sky.</span>
                </h1>
                <p className="text-lg opacity-80 leading-relaxed max-w-lg">
                    The safest and fastest way to get hearts for Sky: Children of the Light. Join thousands of players enhancing their constellations.
                </p>
                <div className="flex gap-4">
                    <Link href="#products" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all">
                        Explore Packs
                    </Link>
                    <Link href="#how-it-works" className="px-8 py-4 bg-background-light dark:bg-background-dark border-2 border-primary/20 font-bold rounded-full hover:bg-primary/5 transition-all">
                        How it works
                    </Link>
                </div>
            </div>
            
            {/* Fast Buy Card Component */}
            <FastBuyCard />
        </section>
    );
}
