/**
 * Order-related TypeScript type definitions
 */

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
