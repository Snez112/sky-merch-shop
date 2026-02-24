"use client";

import { useEffect } from "react";

/**
 * Hook chặn DevTools bằng nhiều phương pháp:
 * 1. Chặn phím tắt mở DevTools
 * 2. Chặn chuột phải (context menu)
 * 3. Detect DevTools qua debugger timing trick
 * 4. Detect thay đổi kích thước bất thường của window
 */
export function useAntiDevTools() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Chỉ chạy trong production – tránh làm chậm môi trường dev
    if (process.env.NODE_ENV !== "production") return;

    // ──────────────────────────────────────────
    // 1. Chặn phím tắt mở DevTools
    // ──────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      const blocked =
        key === "F12" ||
        (ctrl && shift && (key === "I" || key === "i")) || // Ctrl+Shift+I
        (ctrl && shift && (key === "J" || key === "j")) || // Ctrl+Shift+J
        (ctrl && shift && (key === "C" || key === "c")) || // Ctrl+Shift+C
        (ctrl && (key === "U" || key === "u")) || // Ctrl+U (view source)
        (ctrl && (key === "S" || key === "s")) || // Ctrl+S (save)
        (ctrl && (key === "P" || key === "p")); // Ctrl+P (print → có thể xem source)

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // ──────────────────────────────────────────
    // 2. Chặn chuột phải
    // ──────────────────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // ──────────────────────────────────────────
    // 3. Detect DevTools qua debugger timing trick
    //    Nếu console mở, hàm toString bị override và
    //    tốn nhiều thời gian hơn → redirect
    // ──────────────────────────────────────────
    const detectDevToolsViaDebugger = () => {
      const threshold = 160; // ms
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      if (end - start > threshold) {
        handleDetected();
      }
    };

    // ──────────────────────────────────────────
    // 4. Detect qua kích thước window
    //    DevTools dock side/bottom làm thay đổi
    //    innerWidth hoặc innerHeight đáng kể
    // ──────────────────────────────────────────
    const THRESHOLD = 160; // pixel

    const checkWindowSize = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
        handleDetected();
      }
    };

    // ──────────────────────────────────────────
    // 5. Detect qua console object
    //    Chrome ghi chú id của element khi bạn
    //    log một object với getter được định nghĩa
    // ──────────────────────────────────────────
    const detectViaConsole = () => {
      let devtoolsOpen = false;
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          devtoolsOpen = true;
        },
      });
      // Gọi console.log – nếu DevTools mở thì getter chạy
      console.log(element); // eslint-disable-line no-console
      console.clear(); // eslint-disable-line no-console
      if (devtoolsOpen) {
        handleDetected();
      }
    };

    // ──────────────────────────────────────────
    // Hành động khi phát hiện DevTools
    // ──────────────────────────────────────────
    function handleDetected() {
      // Xoá toàn bộ nội dung trang
      document.documentElement.innerHTML = "";
      // Redirect hoặc hiện thông báo
      window.location.href = "about:blank";
    }

    // ──────────────────────────────────────────
    // Đăng ký listeners
    // ──────────────────────────────────────────
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    // Kiểm tra định kỳ
    const intervalId = setInterval(() => {
      checkWindowSize();
      detectViaConsole();
    }, 1000);

    // Chạy debugger check ít thường xuyên hơn (tránh spam)
    const debuggerIntervalId = setInterval(() => {
      detectDevToolsViaDebugger();
    }, 3000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      clearInterval(intervalId);
      clearInterval(debuggerIntervalId);
    };
  }, []);
}
