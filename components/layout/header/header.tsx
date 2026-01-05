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
        <>
            <Announcement />
            <header className="sticky pt-[0.5rem] h-full top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border flex justify-between items-center font-header">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">

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
                        <nav className="hidden md:flex items-center gap-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-foreground hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>


                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <nav className="md:hidden py-4 border-t border-border">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header></>
    )
}
