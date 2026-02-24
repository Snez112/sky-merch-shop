"use client";

import { useAntiDevTools } from "@/hooks/useAntiDevTools";

/**
 * Component không render gì cả – chỉ chạy hook chặn DevTools.
 * Đặt vào RootLayout để áp dụng toàn bộ app.
 */
export default function AntiDevTools() {
  useAntiDevTools();
  return null;
}
