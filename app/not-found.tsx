import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[length:400%_400%] animate-gradient bg-gradient-to-br from-[var(--sky-bg-deep)] via-[var(--sky-bg-main)] to-[var(--sky-bg-deep)] text-white px-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* Sky / Cloud Effect Decoration (optional) */}
        <div className="mb-8 relative">
          <h1 className="text-9xl font-bold tracking-tighter opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--sky-gold-main)] drop-shadow-md">
              Page Not Found
            </h2>
          </div>
        </div>

        <p className="text-lg md:text-xl text-[var(--sky-text-muted)] font-light">
          Oops! Có vẻ như bạn đang lạc vào một vùng trời chưa được khai phá. Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--sky-gold-main)] text-[var(--sky-bg-deep)] font-semibold hover:bg-[var(--sky-gold-soft)] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <MoveLeft className="w-5 h-5" />
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
