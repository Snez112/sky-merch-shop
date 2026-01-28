/**
 * Cookie utility functions for client-side cookie management
 */

export interface CookieOptions {
    expires?: Date | number; // Date object or minutes from now
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Set a cookie with the given name, value, and options
 * @param name - Cookie name
 * @param value - Cookie value (will be JSON stringified if object)
 * @param options - Cookie options
 */
export function setCookie(name: string, value: any, options: CookieOptions = {}): void {
    const {
        expires,
        path = '/',
        domain,
        secure = false,
        sameSite = 'Lax'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)}`;

    if (expires) {
        const expiresDate = expires instanceof Date 
            ? expires 
            : new Date(Date.now() + expires * 60 * 1000); // Convert minutes to milliseconds
        cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    if (path) {
        cookieString += `; path=${path}`;
    }

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    if (secure) {
        cookieString += '; secure';
    }

    if (sameSite) {
        cookieString += `; SameSite=${sameSite}`;
    }

    document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @param parseJSON - Whether to parse the value as JSON (default: true)
 * @returns Cookie value or null if not found
 */
export function getCookie<T = any>(name: string, parseJSON: boolean = true): T | string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        if (!cookieValue) return null;
        
        const decodedValue = decodeURIComponent(cookieValue);
        
        if (parseJSON) {
            try {
                return JSON.parse(decodedValue) as T;
            } catch {
                return decodedValue as any;
            }
        }
        
        return decodedValue;
    }
    
    return null;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 * @param path - Cookie path (default: '/')
 */
export function deleteCookie(name: string, path: string = '/'): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
    return getCookie(name, false) !== null;
}

/**
 * Get all cookies as an object
 * @returns Object with all cookies
 */
export function getAllCookies(): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
    });
    
    return cookies;
}
