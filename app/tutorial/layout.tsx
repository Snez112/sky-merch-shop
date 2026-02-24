import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hướng Dẫn Nhận Tim Sky Chi Tiết | Tim Siêu Nhanh",
    description:
        "Hướng dẫn chi tiết các bước để nhận tim (heart) trong Sky: Children of the Light qua mã kết bạn và note nến. Đơn giản, an toàn và hiệu quả.",
    keywords: [
        "hướng dẫn nạp tim sky",
        "cách nhận tim sky",
        "sky children of the light tutorial",
        "mã kết bạn sky",
    ],
    openGraph: {
        title: "Hướng Dẫn Nhận Tim Sky Chi Tiết | Tim Siêu Nhanh",
        description:
            "Hướng dẫn chi tiết các bước để nhận tim qua mã kết bạn và note nến trong Sky: Children of the Light.",
        type: "website",
    },
};

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
    return children;
}
