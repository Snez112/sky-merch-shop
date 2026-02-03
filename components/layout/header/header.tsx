"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Heart, Sun, Moon } from "@/components/icons"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Verify mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
             <header className="sticky top-0 z-50 glass-nav border-b border-[#f4e7e7] dark:border-[#3d2020] px-6 lg:px-40 py-4 font-display">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                     {/* Skeleton or static header to prevent layout shift */}
                     <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Heart className="w-5 h-5 fill-white" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-primary">Heart of the Game</h2>
                    </div>
                </div>
            </header>
        )
    }

    const menuItems = [
        { label: "Home", href: "/" },
        { label: "Product", href: "/products" },
        { label: "My Orders", href: "/orders" },
        { label: "FAQ", href: "/faq" },
        { label: "Support", href: "/support" },
    ]

    return (
        <header className="sticky top-0 z-50 glass-nav border-b border-[#f4e7e7] dark:border-[#3d2020] px-6 lg:px-40 py-4 font-display">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Heart className="w-5 h-5 fill-white" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-primary">Heart of the Game</h2>
                </Link>
                <nav className="hidden md:flex flex-1 justify-end gap-10">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-semibold hover:text-primary transition-colors text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-4 ml-10">
                    <button 
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                    {/* Menu button removed as requested */}
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass-nav border-b border-[#f4e7e7] dark:border-[#3d2020] p-6 flex flex-col gap-4 shadow-xl">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-semibold hover:text-primary transition-colors text-foreground"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
