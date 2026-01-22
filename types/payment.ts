/**
 * Payment-related TypeScript type definitions
 */

export interface VerifyPaymentParams {
  code: string;
  creator: string;
  userid: string | number;
  amount: number;
  token: string;
  maxAttempts?: number;
  intervalMs?: number;
}

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
  transaction_date: string;
  account_number: string;
  sub_account: string;
  code_tt: string;
  content: string;
  type: string;
  amount: number;
  transaction_id: string;
  balance: number;
}

export interface TaskData {
  code: string;
  creator: string;
  state: string;
  alreadySent: number;
  target: number;
  repeatedly?: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    task: TaskData;
    transaction: BankTransaction;
    orderStatus: string;
  };
}
