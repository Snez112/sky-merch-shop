/**
 * Order-related TypeScript type definitions
 */

/**
 * Order status constants
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CREATED: 'created',
  REMOVED: 'removed',
  EXPIRED: 'expired',
  NOT_FOUND: 'not_found',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * Order row from Google Sheet LIST
 */
export interface OrderRow {
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

/**
 * API response from /api/sheet
 */
export interface SheetResponse<T = any> {
  ok: boolean;
  data: T[];
}

/**
 * Order status check response
 */
export interface OrderStatusResponse {
  status: OrderStatus;
  message?: string;
  data: OrderRow | null;
  remainingSeconds?: number; // Time left until order expires
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  amount?: number;
}

export interface DraftOrderParams {
  code: string;
  quantity: number;
  productPrice: number;
  productName: string;
}

export interface DraftOrderData {
  code: string;
  target: number;
  alreadySent: number;
  money: number;
  orderStatus: string;
  timeCreate: string;
}

export interface DraftOrderResponse {
  success: boolean;
  data: DraftOrderData;
}

export interface UpdateOrderParams {
  code: string;
  updates: {
    orderStatus?: string;
    bankCode?: string;
    refCode?: string;
    bankTime?: string;
    doneTime?: string;
    alreadySent?: number;
  };
}

export interface UpdateOrderResponse {
  success: boolean;
  message: string;
}
