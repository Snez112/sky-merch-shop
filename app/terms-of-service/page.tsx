import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều Khoản Dịch Vụ - Tim Siêu Nhanh",
  description: "Điều khoản và điều kiện sử dụng dịch vụ giao Heart cho Sky: Children of the Light. Quy trình đặt hàng, thanh toán, giao hàng, chính sách hoàn tiền và bảo hành tài khoản.",
  keywords: ["điều khoản dịch vụ", "terms of service", "quy định", "tim siêu nhanh"],
  openGraph: {
    title: "Điều Khoản Dịch Vụ - Tim Siêu Nhanh",
    description: "Tìm hiểu về điều khoản và điều kiện sử dụng dịch vụ của chúng tôi",
    type: "website",
  },
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#1c0d0d] dark:text-white transition-colors duration-300">
            <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Điều Khoản Dịch Vụ</h1>
                    <p className="text-sm opacity-60">Cập nhật lần cuối: 01/02/2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none space-y-8">
                    {/* Section 1 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">1. Chấp Nhận Điều Khoản</h2>
                        <p className="opacity-80 leading-relaxed">
                            Bằng cách truy cập và sử dụng dịch vụ của Tim Siêu Nhanh, bạn đồng ý tuân theo các Điều Khoản Dịch Vụ này.
                            Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">2. Mô Tả Dịch Vụ</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Tim Siêu Nhanh cung cấp dịch vụ giao Tim (Hearts) cho người chơi Sky: Children of the Light thông qua
                            phương pháp hợp lệ và tuân thủ Điều Khoản Dịch Vụ (TOS) của game.
                        </p>
                        <ul className="list-disc list-inside space-y-2 opacity-80">
                            <li>Chúng tôi sử dụng tài khoản thật để gửi Tim</li>
                            <li>Đảm bảo an toàn 100% cho tài khoản của bạn</li>
                            <li>Thời gian giao hàng thông thường: 1-24 giờ tùy thuộc vào số lượng</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">3. Quy Trình Đặt Hàng</h2>
                        <div className="space-y-4 opacity-80">
                            <div>
                                <h3 className="font-bold mb-2">3.1. Yêu Cầu Đặt Hàng</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cung cấp Friend Code hợp lệ từ Sky: Children of the Light</li>
                                    <li>Đặt Candle Note tại vị trí được chỉ định</li>
                                    <li>Số lượng tối thiểu: 30 Tim</li>
                                    <li>Thanh toán đầy đủ trước khi bắt đầu giao hàng</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">3.2. Xác Nhận Đơn Hàng</h3>
                                <p>
                                    Sau khi nhận được thanh toán, chúng tôi sẽ xác nhận đơn hàng của bạn qua email hoặc phương thức
                                    liên lạc đã đăng ký. Đơn hàng sẽ bắt đầu được xử lý trong vòng 1-2 giờ.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">4. Thanh Toán và Giá Cả</h2>
                        <div className="space-y-4 opacity-80">
                            <div>
                                <h3 className="font-bold mb-2">4.1. Phương Thức Thanh Toán</h3>
                                <p>Chúng tôi chấp nhận các phương thức thanh toán sau:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                    <li>Chuyển khoản ngân hàng</li>
                                    <li>Ví điện tử (Momo, ZaloPay, VNPay) - <span className="italic text-sm opacity-60">(Đang phát triển)</span></li>
                                    <li>Thẻ tín dụng/ghi nợ - <span className="italic text-sm opacity-60">(Đang phát triển)</span></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">4.2. Giá Cả</h3>
                                <p>
                                    Giá cả được niêm yết rõ ràng trên website. Chúng tôi có quyền thay đổi giá bất kỳ lúc nào,
                                    nhưng giá đã xác nhận cho đơn hàng của bạn sẽ không thay đổi.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">4.3. Thuế và Phí</h3>
                                <p>
                                    Tất cả giá đã bao gồm thuế VAT (nếu có). Không có phí ẩn.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">5. Giao Hàng</h2>
                        <div className="space-y-4 opacity-80">
                            <div>
                                <h3 className="font-bold mb-2">5.1. Thời Gian Giao Hàng</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Đơn hàng bắt đầu trong vòng 5-10 phút sau khi thanh toán</li>
                                    <li>Thời gian hoàn thành: 1-24 giờ tùy thuộc vào số lượng Tim</li>
                                    <li>Tim được gửi theo lịch trình phù hợp với cơ chế game (tránh spam)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">5.2. Theo Dõi Đơn Hàng</h3>
                                <p>
                                    Bạn có thể liên hệ với chúng tôi bất kỳ lúc nào để kiểm tra trạng thái đơn hàng qua email hoặc
                                    các kênh hỗ trợ.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">6. Chính Sách Hoàn Tiền</h2>
                        <div className="space-y-4 opacity-80">
                            <div>
                                <h3 className="font-bold mb-2">6.1. Hoàn Tiền Đầy Đủ</h3>
                                <p>Bạn sẽ nhận được hoàn tiền 100% trong các trường hợp sau:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                    <li>Chúng tôi không thể hoàn thành đơn hàng vì lý do kỹ thuật</li>
                                    <li>Friend Code không hợp lệ do lỗi từ phía chúng tôi</li>
                                    <li>Đơn hàng không được bắt đầu trong vòng 24 giờ (trừ trường hợp bất khả kháng)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">6.2. Không Hoàn Tiền</h3>
                                <p>Chúng tôi KHÔNG hoàn tiền trong các trường hợp sau:</p>
                                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                                    <li>Bạn cung cấp Friend Code sai hoặc không hợp lệ</li>
                                    <li>Bạn không đặt Candle Note theo hướng dẫn</li>
                                    <li>Bạn thay đổi ý định sau khi đơn hàng đã bắt đầu</li>
                                    <li>Tài khoản của bạn bị khóa do vi phạm TOS của game (không liên quan đến dịch vụ của chúng tôi)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">6.3. Thời Gian Hoàn Tiền</h3>
                                <p>
                                    Hoàn tiền sẽ được xử lý trong vòng 3-5 ngày làm việc kể từ khi yêu cầu được chấp thuận.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">6.4. Bảo Hành An Toàn Tài Khoản</h3>
                                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded">
                                    <p className="font-semibold">
                                        Chúng tôi sẽ hoàn tiền và đền bù 100% nếu tài khoản của bạn bị ban do lỗi từ phía
                                        chúng tôi trong vòng 1 tháng kể từ khi giao hàng hoàn tất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">7. Trách Nhiệm và Giới Hạn</h2>
                        <div className="space-y-4 opacity-80">
                            <div>
                                <h3 className="font-bold mb-2">7.1. Trách Nhiệm Của Chúng Tôi</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cung cấp dịch vụ đúng như mô tả</li>
                                    <li>Bảo mật thông tin khách hàng</li>
                                    <li>Hỗ trợ khách hàng 24/7</li>
                                    <li>Hoàn tiền khi không thể hoàn thành dịch vụ</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">7.2. Trách Nhiệm Của Bạn</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Cung cấp thông tin chính xác và hợp lệ</li>
                                    <li>Tuân thủ hướng dẫn của chúng tôi</li>
                                    <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                                    <li>Thanh toán đầy đủ và đúng hạn</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">7.3. Giới Hạn Trách Nhiệm</h3>
                                <p>
                                    Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả nào
                                    phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi. Trách nhiệm tối đa
                                    của chúng tôi giới hạn ở số tiền bạn đã thanh toán cho đơn hàng cụ thể.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">8. Quyền Sở Hữu Trí Tuệ</h2>
                        <p className="opacity-80 leading-relaxed">
                            Tất cả nội dung trên website này, bao gồm văn bản, hình ảnh, logo và thiết kế, là tài sản của
                            Tim Siêu Nhanh và được bảo vệ bởi luật bản quyền. Bạn không được sao chép, phân phối hoặc sử dụng
                            bất kỳ nội dung nào mà không có sự cho phép bằng văn bản từ chúng tôi.
                        </p>
                        <p className="opacity-80 leading-relaxed mt-4">
                            <strong>Lưu ý:</strong> Sky: Children of the Light và tất cả các nhãn hiệu liên quan là tài sản
                            của thatgamecompany. Chúng tôi không liên kết chính thức với thatgamecompany.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">9. Chấm Dứt Dịch Vụ</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Chúng tôi có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn vào dịch vụ ngay lập tức,
                            không cần thông báo trước, nếu bạn vi phạm các Điều Khoản Dịch Vụ này.
                        </p>
                        <p className="opacity-80 leading-relaxed">
                            Các hành vi vi phạm bao gồm nhưng không giới hạn:
                        </p>
                        <ul className="list-disc list-inside space-y-1 opacity-80 ml-4 mt-2">
                            <li>Cung cấp thông tin sai lệch</li>
                            <li>Lạm dụng dịch vụ hoặc hỗ trợ khách hàng</li>
                            <li>Yêu cầu hoàn tiền gian lận</li>
                            <li>Vi phạm pháp luật hoặc quyền của người khác</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">10. Thay Đổi Điều Khoản</h2>
                        <p className="opacity-80 leading-relaxed">
                            Chúng tôi có quyền sửa đổi hoặc thay thế các Điều Khoản Dịch Vụ này bất kỳ lúc nào. Các thay đổi
                            quan trọng sẽ được thông báo qua email hoặc thông báo trên website ít nhất 7 ngày trước khi có hiệu lực.
                            Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận
                            các điều khoản mới.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">11. Luật Áp Dụng</h2>
                        <p className="opacity-80 leading-relaxed">
                            Các Điều Khoản Dịch Vụ này được điều chỉnh và giải thích theo luật pháp Việt Nam. Mọi tranh chấp
                            phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section className="bg-gray-50 dark:bg-card-dark p-6 sm:p-8 rounded-xl border border-primary/10 dark:border-primary/5">
                        <h2 className="text-2xl font-bold mb-4 text-primary">12. Liên Hệ</h2>
                        <p className="opacity-80 leading-relaxed mb-4">
                            Nếu bạn có bất kỳ câu hỏi nào về Điều Khoản Dịch Vụ này, vui lòng liên hệ với chúng tôi:
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
