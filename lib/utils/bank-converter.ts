/**
 * Types for Google Sheet Bank Data
 */

export interface BankTransactionRaw {
    "Ngân hàng": string;
    "Ngày giao dịch": string;
    "Số tài khoản": string;
    "Tài khoản phụ": string;
    "Code TT": string;
    "Nội dung thanh toán": string;
    "Loại": string;
    "Số tiền": number;
    "Mã tham chiếu": string;
    "Lũy kế": number;
}
  
export interface BankTransaction {
    gateway: string;
    date: string;
    accountNumber: string;
    subAccount: string;
    codeTT: string;
    content: string;
    type: string;
    amount: number;
    transactionId: string;
    balance: number;
}

/**
 * Converts raw Vietnamese bank transaction keys to standardized English keys
 * @param raw - The raw transaction object from Google Sheets
 * @returns Standardized BankTransaction object
 */
export function convertBankTransaction(raw: BankTransactionRaw): BankTransaction {
    return {
        gateway: raw["Ngân hàng"] || "",
        date: raw["Ngày giao dịch"] || "",
        accountNumber: raw["Số tài khoản"] || "",
        subAccount: raw["Tài khoản phụ"] || "",
        codeTT: raw["Code TT"] || "",
        content: raw["Nội dung thanh toán"] || "",
        type: raw["Loại"] || "",
        amount: Number(raw["Số tiền"]) || 0,
        transactionId: raw["Mã tham chiếu"] || "",
        balance: Number(raw["Lũy kế"]) || 0,
    };
}

/**
 * Converts an array of raw transactions
 */
export function convertBankTransactions(rawData: any[]): BankTransaction[] {
    if (!Array.isArray(rawData)) return [];
    return rawData.map(item => convertBankTransaction(item));
}

/**
 * Extracts the clean content (removing usage prefixes)
 * @param content - The raw content string (e.g. "CK 123 ABC")
 * @param expectedCode - The code we are looking for (e.g. "ABC")
 * @returns Cleaned content string starting from the found code, or original if not found
 */
export function getCleanContent(content: string, expectedCode?: string): string {
    if (!content) return "";
    if (!expectedCode) return content;

    // Normalize comparison
    const normContent = content.toLowerCase();
    const normCode = expectedCode.toLowerCase();
    
    const index = normContent.indexOf(normCode);
    
    if (index !== -1) {
        // Return substrings starting from the match, preserving original casing
        // This removes prefixes like "Ck ", "Momo ", "Techcombank " etc.
        return content.substring(index);
    }
    
    return content;
}
