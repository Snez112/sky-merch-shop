import Link from "next/link";

export default function SupportSection() {
    return (
        <section className="py-20 mb-10 text-foreground" id="support">
            <div className="bg-secondary/20 rounded-xl p-10 flex flex-col items-center text-center">
                <h2 className="text-3xl font-black mb-4">Connect with our Community</h2>
                <p className="max-w-xl opacity-70 mb-8">Have questions? Join our official social channels for updates, giveaways, and 24/7 customer support.</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="#" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#2d1818] rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-[#1877F2]">social_leaderboard</span>
                        Facebook
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#2d1818] rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-[#5865F2]">forum</span>
                        Discord
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#2d1818] rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-[#26A5E4]">send</span>
                        Telegram
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#2d1818] rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-primary">mail</span>
                        Email Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
