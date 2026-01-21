/**
 * Google Sheets-related TypeScript type definitions
 */

export interface SheetRowData {
  code: string;
  target: number;
  alreadySent: number;
  money: number;
  bankCode: string;
  refCode: string;
  timeCreate: string;
  orderStatus: string;
  bankTime: string;
  doneTime: string;
}

export interface PriceData {
  AMOUNT: number;
  PRICE: number;
}

export interface OrderData {
  STT: number;
  CODE: string;
  AMOUNT: number;
  ALREADYSENT: number;
  MONEY: number;
  BANK_CODE: string;
  REF_CODE: string;
  TIME_CREATE: string;
  ORDER_STATUS: string;
  BANK_TIME: string;
  DONE_TIME: string;
}

export interface SheetResponse<T = any> {
  success?: boolean;
  data: T[];
  error?: string;
}
