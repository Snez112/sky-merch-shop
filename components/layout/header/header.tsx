"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import Announcement from "./announcement"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const cartCount = 0

    const menuItems = [
        { label: "Shop", href: "/shop" },
        { label: "Collections", href: "/collections" },
        { label: "News", href: "/news" },
        { label: "About", href: "/about" },
    ]

    return (
        <div
            className="sticky top-0 z-40 w-full backdrop-blur-sm"
            style={{
                backgroundImage: 'url("/header-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Announcement />
            <header className="pt-[0.5rem] w-full border-none flex justify-between items-center font-header">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center mr-16">
                            <div
                                className="size-[5rem] bg-sky-500" /* <--- CHANGE COLOR HERE (e.g., bg-red-500, bg-primary) */
                                style={{
                                    maskImage: 'url("/sky-logo-white.png")', /* The image becomes the shape */
                                    WebkitMaskImage: 'url("/sky-logo-white.png")', /* Safari support */
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'left center',
                                    WebkitMaskPosition: 'left center'
                                }}
                            />
                        </Link>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-black hover:text-black/80 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <nav className="md:hidden py-4 border-t border-white/10">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block py-2 text-sm text-white hover:text-white/80 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>
        </div>
    )
}
