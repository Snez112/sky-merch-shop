/**
 * Input Sanitization Utilities
 * Clean and validate user inputs
 */

/**
 * Sanitize code input
 * Allows only alphanumeric characters and hyphens
 * 
 * @param code - Code to sanitize
 * @returns Sanitized code
 */
export function sanitizeCode(code: string): string {
  // Remove any characters that aren't alphanumeric or hyphen
  return code.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Sanitize sheet name
 * Allows only alphanumeric characters, underscores, and hyphens
 * 
 * @param sheetName - Sheet name to sanitize
 * @returns Sanitized sheet name
 */
export function sanitizeSheetName(sheetName: string): string {
  return sheetName.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Sanitize text input
 * Removes potential XSS vectors
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize number
 * 
 * @param value - Value to validate
 * @param options - Validation options
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumber(
  value: any,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number | null {
  const num = Number(value);
  
  if (isNaN(num)) {
    return null;
  }
  
  if (options.integer && !Number.isInteger(num)) {
    return null;
  }
  
  if (options.min !== undefined && num < options.min) {
    return null;
  }
  
  if (options.max !== undefined && num > options.max) {
    return null;
  }
  
  return num;
}

/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize object by removing null/undefined values
 * 
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}
