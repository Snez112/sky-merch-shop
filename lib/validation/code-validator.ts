/**
 * Code validation utilities
 */

/**
 * Validate code format
 * Accepts: a-Z, 0-9, and hyphens (-)
 * Formats: XXXX-XXXX-XXXX or XXXXXXXXXXXX (12 characters)
 */
export function isValidGenerateCode(code: string): boolean {
  const value = code.trim();
  return /^([a-zA-Z0-9]{4}(?:-[a-zA-Z0-9]{4}){2}|[a-zA-Z0-9]{12})$/.test(value);
}

/**
 * Generate a random code
 * Format: 12 uppercase alphanumeric characters
 */
export function generateCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

/**
 * Validate input length for Friend Code
 * Returns true if alphanumeric count <= 12
 */
export function validateFriendCodeLimit(input: string): boolean {
  const cleanVal = input.replace(/[^a-zA-Z0-9]/g, '');
  return cleanVal.length <= 12;
}

/**
 * Format Friend Code input
 * - Trims whitespace
 * - Converts to Uppercase
 */
export function formatFriendCode(input: string): string {
  return input.trim().toUpperCase();
}
