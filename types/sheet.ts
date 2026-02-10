/**
 * Google Sheets-related TypeScript type definitions
 */

export interface SheetRowData {
  operation?: 'CREATE' | 'UPDATE';
  updates?: {
    alreadySent?: number;
    orderStatus?: string;
    bankCode?: string;
    refCode?: string;
    bankTime?: string;
    doneTime?: string;
  };
  code: string;
  target?: number;
  alreadySent?: number;
  money?: number;
  bankCode?: string;
  refCode?: string;
  timeCreate?: string | Date; // Allow Date object
  orderStatus?: string;
  bankTime?: string;
  doneTime?: string;
  coupon?: string;
  discount?: number;
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
