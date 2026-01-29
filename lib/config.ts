/**
 * Application configuration constants
 */

/**
 * Order expiry time in minutes
 */
export const ORDER_EXPIRY_MINUTES = 20;

/**
 * Countdown warning threshold in seconds (5 minutes)
 */
export const COUNTDOWN_WARNING_THRESHOLD = 300;

/**
 * Default pagination limit
 */
export const DEFAULT_PAGE_LIMIT = 50;

/**
 * Cache revalidation times (in seconds)
 */
export const CACHE_REVALIDATION = {
  PRICE_DATA: 30,
  BANK_DATA: 10,
  ORDER_DATA: 5,
} as const;
