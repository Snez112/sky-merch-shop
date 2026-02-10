import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseFriendCodeValidationResult {
  codeError: string;
  isValidating: boolean;
  isTyping: boolean;
}

/**
 * Custom hook for friend code validation with debounce and SWR caching
 * 
 * @param friendCode - The friend code to validate
 * @returns Object containing codeError message, isValidating state, and isTyping state
 * 
 * @example
 * ```tsx
 * const { codeError, isValidating, isTyping } = useFriendCodeValidation(friendCode);
 * ```
 */
export function useFriendCodeValidation(friendCode: string): UseFriendCodeValidationResult {
  const [debouncedCode, setDebouncedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Debounce friend code input
  useEffect(() => {
    // User is typing if friendCode differs from debouncedCode
    if (friendCode !== debouncedCode) {
      setIsTyping(true);
    }

    const timer = setTimeout(() => {
      setDebouncedCode(friendCode);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [friendCode, debouncedCode]);

  // Validate friend code with SWR
  const shouldValidate = debouncedCode.length === 12 || debouncedCode.length === 14;
  const { data: validationData, isLoading: isValidating } = useSWR(
    shouldValidate ? `/api/validate-code?code=${debouncedCode}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  // Compute error message from validation data
  const codeError = useMemo(() => {
    if (!shouldValidate) return "";
    if (!validationData) return "";
    
    if (!validationData.valid) {
      return "Friend Code không đúng định dạng";
    }
    if (validationData.exists) {
      return "Friend Code đã tồn tại";
    }
    return "";
  }, [validationData, shouldValidate]);

  return {
    codeError,
    isValidating,
    isTyping,
  };
}
