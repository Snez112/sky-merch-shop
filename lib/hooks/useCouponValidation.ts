import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { CouponData } from "@/app/api/validate-coupon/route";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseCouponValidationResult {
  couponData: CouponData | null;
  couponError: string;
  isValidating: boolean;
  isTyping: boolean;
}

/**
 * Custom hook for coupon validation with debounce and SWR caching
 * 
 * @param couponCode - The coupon code to validate
 * @returns Object containing couponData, couponError, isValidating, and isTyping
 * 
 * @example
 * ```tsx
 * const { couponData, couponError, isValidating, isTyping } = useCouponValidation(couponCode);
 * ```
 */
export function useCouponValidation(couponCode: string): UseCouponValidationResult {
  const [debouncedCode, setDebouncedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Debounce coupon code input
  useEffect(() => {
    // User is typing if couponCode differs from debouncedCode
    if (couponCode !== debouncedCode) {
      setIsTyping(true);
    }

    const timer = setTimeout(() => {
      setDebouncedCode(couponCode);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [couponCode, debouncedCode]);

  // Validate coupon with SWR (only if code is not empty)
  const shouldValidate = debouncedCode.trim().length > 0;
  const { data: validationData, isLoading: isValidating } = useSWR(
    shouldValidate ? `/api/validate-coupon?code=${debouncedCode}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  // Compute coupon data and error message
  const { couponData, couponError } = useMemo(() => {
    if (!shouldValidate) {
      return { couponData: null, couponError: "" };
    }

    if (!validationData) {
      return { couponData: null, couponError: "" };
    }

    if (!validationData.valid) {
      if (!validationData.exists) {
        return { couponData: null, couponError: "Mã giảm giá không tồn tại" };
      }
      return { couponData: null, couponError: "Mã giảm giá đã hết lượt sử dụng" };
    }

    return { couponData: validationData.coupon, couponError: "" };
  }, [validationData, shouldValidate]);

  return {
    couponData,
    couponError,
    isValidating,
    isTyping,
  };
}
