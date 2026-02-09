"use client";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
            <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Chính Sách Bảo Mật</h1>
                    <p className="text-sm opacity-60">Cập nhật lần cuối: 01/02/2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-8">
                    {/* Section 1 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">1. Thông Tin Chúng Tôi Thu Thập</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Khi bạn sử dụng dịch vụ của chúng tôi, chúng tôi có thể thu thập các thông tin sau:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li><strong>Thông tin tài khoản:</strong> Friend Code của bạn trong game Sky: Children of the Light</li>
                            <li><strong>Thông tin thanh toán:</strong> Thông tin cần thiết để xử lý giao dịch (không lưu trữ thông tin thẻ tín dụng)</li>
                            <li><strong>Thông tin liên hệ:</strong> Email hoặc số điện thoại để hỗ trợ khách hàng</li>
                            <li><strong>Dữ liệu sử dụng:</strong> Thông tin về cách bạn sử dụng website của chúng tôi</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">2. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Thông tin của bạn được sử dụng cho các mục đích sau:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li>Xử lý và hoàn thành đơn hàng của bạn</li>
                            <li>Gửi thông báo về trạng thái đơn hàng</li>
                            <li>Cung cấp hỗ trợ khách hàng</li>
                            <li>Cải thiện dịch vụ và trải nghiệm người dùng</li>
                            <li>Phát hiện và ngăn chặn gian lận</li>
                            <li>Tuân thủ các nghĩa vụ pháp lý</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">3. Bảo Mật Thông Tin</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiêu chuẩn ngành:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li>Mã hóa SSL/TLS cho tất cả các giao dịch</li>
                            <li>Lưu trữ dữ liệu an toàn trên máy chủ được bảo vệ</li>
                            <li>Giới hạn quyền truy cập chỉ cho nhân viên được ủy quyền</li>
                            <li>Thường xuyên kiểm tra và cập nhật các biện pháp bảo mật</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">4. Chia Sẻ Thông Tin</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Chúng tôi <strong>KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba cho mục đích tiếp thị.
                            Thông tin của bạn chỉ được chia sẻ trong các trường hợp sau:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li>Với các nhà cung cấp dịch vụ thanh toán để xử lý giao dịch</li>
                            <li>Khi được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền</li>
                            <li>Để bảo vệ quyền lợi và an toàn của chúng tôi và người dùng khác</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">5. Quyền Của Bạn</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Bạn có các quyền sau đối với thông tin cá nhân của mình:
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li><strong>Quyền truy cập:</strong> Yêu cầu xem thông tin cá nhân mà chúng tôi lưu trữ</li>
                            <li><strong>Quyền chỉnh sửa:</strong> Yêu cầu sửa đổi thông tin không chính xác</li>
                            <li><strong>Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân của bạn</li>
                            <li><strong>Quyền phản đối:</strong> Phản đối việc xử lý thông tin của bạn</li>
                        </ul>
                        <p className="opacity-80 leading-relaxed mt-4">
                            Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email:
                            <a href="mailto:support@timsieunhanh.com" className="text-primary font-semibold hover:underline ml-1">
                                support@timsieunhanh.com
                            </a>
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">6. Cookies và Công Nghệ Theo Dõi</h2>
                        <p className="opacity-80 leading-relaxed">
                            Website của chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện trải nghiệm người dùng,
                            phân tích lưu lượng truy cập và cá nhân hóa nội dung. Bạn có thể quản lý tùy chọn cookies thông qua
                            cài đặt trình duyệt của mình.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">7. Thay Đổi Chính Sách</h2>
                        <p className="opacity-80 leading-relaxed">
                            Chúng tôi có thể cập nhật Chính Sách Bảo Mật này theo thời gian. Mọi thay đổi sẽ được đăng tải trên
                            trang này với ngày cập nhật mới. Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ để nắm
                            được cách chúng tôi bảo vệ thông tin của bạn.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-white dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">8. Liên Hệ</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này, vui lòng liên hệ với chúng tôi:
                        </p>
                        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                            <p className="opacity-80">
                                <strong>Email:</strong>{" "}
                                <a href="mailto:support@timsieunhanh.com" className="text-primary hover:underline">
                                    support@timsieunhanh.com
                                </a>
                            </p>
                            <p className="opacity-80">
                                <strong>Website:</strong>{" "}
                                <a href="/" className="text-primary hover:underline">
                                    Tim Siêu Nhanh
                                </a>
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
