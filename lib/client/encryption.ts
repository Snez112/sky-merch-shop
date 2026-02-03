import CryptoJS from 'crypto-js';

const CLIENT_SECRET_KEY = process.env.NEXT_PUBLIC_CLIENT_SECRET || "SKY_MERCH_SECURE_CLIENT_2024";

/**
 * Encrypt data for client-side storage (Cookie/LocalStorage)
 * Note: This provides obfuscation, not absolute security against determined client-side attacks
 */
export function encryptData(data: any): string {
    try {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, CLIENT_SECRET_KEY).toString();
    } catch (error) {
        console.error("Encryption failed:", error);
        return "";
    }
}

/**
 * Decrypt data from client-side storage
 */
export function decryptData(ciphertext: string): any {
    try {
        if (!ciphertext) return null;
        const bytes = CryptoJS.AES.decrypt(ciphertext, CLIENT_SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}
