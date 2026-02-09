import Link from "next/link"

export default function SimpleFooter() {
    return (
        <footer className="bg-background-light dark:bg-background-dark py-12 px-6">
            {/* Decorative Divider */}
            <div className="flex items-center justify-center py-10 opacity-20">
                <div className="h-px bg-primary flex-1 max-w-[100px]"></div>
                <div className="px-6 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>filter_vintage</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>stat_3</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>filter_vintage</span>
                </div>
                <div className="h-px bg-primary flex-1 max-w-[100px]"></div>
            </div>

            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                    </div>
                    <h2 className="text-sm sm:text-lg font-black tracking-tight text-primary uppercase">TIM SIÊU NHANH</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                        Trang Chủ
                    </Link>
                    <Link href="/privacy-policy" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                        Chính Sách Bảo Mật
                    </Link>
                    <Link href="/terms-of-service" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                        Điều Khoản Dịch Vụ
                    </Link>
                </div>
                <div className="text-gray-500 text-[11px] opacity-40 text-center">
                    Copyright © 2026 Fast Heart All rights reserved. This website is not affiliated with TGC.
                </div>
            </div>
        </footer>
    )
}
