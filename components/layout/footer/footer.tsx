import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-card-dark border-t border-[#f4e7e7] dark:border-[#1e3a5f] py-10 sm:py-12 px-4 sm:px-6 lg:px-40">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                        </div>
                        <h2 className="text-sm sm:text-lg font-black tracking-tight text-primary uppercase">TIM SIÊU NHANH</h2>
                    </div>
                    <p className="text-xs sm:text-sm opacity-50 max-w-sm mx-auto md:mx-0">
                        Uy tín - Nhanh chóng - Giá cả phải chăng.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
                    <h5 className="font-bold uppercase tracking-widest text-xs opacity-50">Về Dịch Vụ</h5>
                    <p className="text-xs sm:text-sm opacity-60 max-w-sm leading-relaxed mx-auto md:mx-0">
                        Sứ mệnh của chúng tôi là cung cấp cách tiếp cận dễ dàng và giá cả phải chăng để người chơi mở khóa
                        vật phẩm và hoàn thiện chòm sao của họ.
                    </p>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-2 justify-center items-center md:items-start md:justify-end">
                        <Link href="/privacy-policy" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                            Chính Sách Bảo Mật
                        </Link>
                        <Link href="/terms-of-service" className="text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                            Điều Khoản Dịch Vụ
                        </Link>
                    </div>
                </div>
            </div>
            <p className="text-[11px] opacity-40 mt-8 pt-8 border-t border-[#f4e7e7] dark:border-[#3d2020] text-center w-full">
                Copyright © 2026 Fast Heart All rights reserved. This website is not affiliated with TGC.
            </p>
        </footer>
    )
}
