"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutIndexPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if accessing /checkout without code
        router.push('/');
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D1A] via-[#1a1a2e] to-[#0D0D1A] flex items-center justify-center">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/20 border-t-cyan-500"></div>
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"></div>
            </div>
        </div>
    );
}
