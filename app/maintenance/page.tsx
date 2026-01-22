import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--sky-bg-deep)] text-white px-4">
      <div className="text-center space-y-8 max-w-2xl bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[var(--sky-bg-main)]/20 shadow-inner">
            <Wrench className="w-16 h-16 text-[var(--sky-gold-main)] animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--sky-gold-main)] to-white">
          Hệ Thống Đang Bảo Trì
        </h1>

        <div className="space-y-4 text-[var(--sky-text-muted)]">
          <p className="text-lg">
            Chúng tôi đang tiến hành nâng cấp hệ thống để mang lại trải nghiệm tốt hơn cho bạn.
            <br />
            Dự kiến sẽ hoàn thành trong thời gian sớm nhất.
          </p>
          <div className="w-16 h-1 bg-[var(--sky-gold-main)] mx-auto rounded-full opacity-50"></div>
          <p className="text-sm opacity-80">
            Xin lỗi vì sự bất tiện này. Vui lòng quay lại sau!
          </p>
        </div>

        {/* Optional: Status/Retry info */}
        {/* <div className="pt-4">
          <button 
            onClick={() => window.location.reload()}
            className="text-sm hover:text-[var(--sky-gold-main)] transition-colors underline underline-offset-4"
          >
            Kiểm tra lại
          </button>
        </div> */}
      </div>
      
      <div className="mt-8 text-sm text-white/40">
        &copy; {new Date().getFullYear()} Sky Merch Team
      </div>
    </div>
  );
}
