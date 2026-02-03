import Link from "next/link"
import { Heart } from "@/components/icons"

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#1a0a0a] border-t border-[#f4e7e7] dark:border-[#3d2020] py-12 px-6 lg:px-40 font-display text-foreground">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white">
                            <Heart className="w-4 h-4 fill-white" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-primary uppercase">Heart of the Game</h2>
                    </div>
                    <p className="text-sm opacity-50 max-w-sm">
                        The premier destination for Sky: Children of the Light collectors. We believe in helping the community light up their path.
                    </p>
                    <p className="text-xs opacity-40 mt-4">
                        © 2024 Heart of the Game. All rights reserved. Not affiliated with thatgamecompany.
                    </p>
                </div>
                <div className="flex flex-col md:items-end gap-6">
                    <h5 className="font-bold uppercase tracking-widest text-xs opacity-50">About the Service</h5>
                    <p className="text-sm opacity-60 md:text-right max-w-sm leading-relaxed">
                        Our mission is to provide an accessible and affordable way for players to unlock cosmetic items and complete their constellations through legitimate peer-to-peer heart trading.
                    </p>
                    <div className="flex gap-6 mt-2">
                        <Link href="#" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">Privacy Policy</Link>
                        <Link href="#" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
