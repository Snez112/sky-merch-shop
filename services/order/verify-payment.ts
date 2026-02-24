"use server";

import { cachedReq } from "@/lib/utils";
import { createTask } from "@/services/task/create-task";
import { createOrder } from "@/services/order/create-order";
import { fetchPricing } from "@/lib/pricing";

interface BankTransactionRaw {
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

interface BankTransactionEnglish {
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

export interface VerifyPaymentParams {
  code: string;
  quantity: number;
  coupon?: string;
  discount?: number;
  isCouponApplied?: boolean; // True only when coupon actually beats system tier
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data: {
    task: {
      code: string;
      creator: string;
      state: string;
      alreadySent: number;
      target: number;
      repeatedly?: number;
    };
    // Transaction details removed for security
    orderStatus: string;
  };
}

// Convert Vietnamese keys to English
function convertBankTransaction(raw: BankTransactionRaw): BankTransactionEnglish {
  return {
    gateway: raw["Ngân hàng"] || "",
    transaction_date: raw["Ngày giao dịch"] || "",
    account_number: raw["Số tài khoản"] || "",
    sub_account: raw["Tài khoản phụ"] || "",
    code_tt: raw["Code TT"] || "",
    content: raw["Nội dung thanh toán"] || "",
    type: raw["Loại"] || "",
    amount: raw["Số tiền"] || 0,
    transaction_id: raw["Mã tham chiếu"] || "",
    balance: raw["Lũy kế"] || 0,
  };
}

/**
 * Verify payment by checking bank transactions and creating order
 * This service handles the complete payment verification flow:
 * 1. Check bank transactions for matching payment
 * 2. Verify payment amount
 * 3. Create task via external API
 * 4. Create confirmed order in Google Sheets
 * 
 * @param params - Payment verification parameters
 * @returns Verified payment data with task and transaction info
 */
export async function verifyPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResponse> {
  const { code, quantity } = params;

  // Get environment variables
  const creator = process.env.CREATOR || process.env.CREATER;
  const userid = process.env.USERID;
  const token = process.env.TOKEN;

  if (!creator || !userid || !token) {
    throw new Error("Missing required environment variables: CREATOR, USERID, or TOKEN");
  }

  try {
    // Get latest bank transactions from Google Sheets
    const bankResponse = await cachedReq("/api/checkBank");
    const rawTransactions: BankTransactionRaw[] = Array.isArray(bankResponse.data)
      ? bankResponse.data
      : [];

    const transactions: BankTransactionEnglish[] = rawTransactions.map(
      convertBankTransaction
    );

    // Find transaction where content includes the code
    // Example: "NOVIP/ABC123456789" or "ACH/ABC123456789"
    const matchingTransaction = transactions.find(
      (t) => t.content && t.content.toUpperCase().includes(code.toUpperCase())
    ) || null;

    if (!matchingTransaction) {
      throw new Error(
        `No transaction found with code: ${code}. Please check your payment and try again.`
      );
    }

    // Verify amount matches expected price
    const pricing = await fetchPricing();
    let expectedPrice = pricing.getPrice(quantity);
    
    // Apply discount ONLY when client confirmed coupon was actually applied
    // (i.e. coupon beats system tier — calculateBestPrice returned isCouponApplied=true)
    if (params.isCouponApplied && params.discount && params.discount > 0) {
        expectedPrice = Math.ceil(expectedPrice / params.discount);
        expectedPrice = Math.ceil(expectedPrice / 100) * 100;
    }
    
    // Check if paid amount is sufficient
    if (matchingTransaction.amount < expectedPrice) {
       throw new Error(
         `Insufficient payment amount. Paid: ${matchingTransaction.amount}, Expected: ${expectedPrice}`
       );
    }

    // Transaction found! Now create task via API
    const taskData = await createTask({
      creator,
      code,
      userid,
      amount: quantity,
      token,
    });

    // Create confirmed order in Google Sheets
    await createOrder({
      code,
      quantity: quantity, 
      productPrice: matchingTransaction.amount, 
      productName: `Heart Pack (via Bank - ${matchingTransaction.amount}đ)`,
      target: quantity,
      money: matchingTransaction.amount,
      
      // Full order details
      bankCode: matchingTransaction.gateway,
      refCode: matchingTransaction.transaction_id,
      bankTime: matchingTransaction.transaction_date,
      orderStatus: taskData.data?.state || "Created",
      coupon: params.coupon,
      discount: params.discount
    });

    return {
      success: true,
      message: "Payment verified successfully",
      data: {
        task: {
          code: taskData.data?.code || code,
          creator: taskData.data?.creator || creator,
          state: taskData.data?.state || "Created",
          alreadySent: taskData.data?.alreadySent || 0,
          target: taskData.data?.target || 0,
          repeatedly: taskData.data?.repeatedly,
        },
        // Transaction details removed for security
        // Bank data is processed server-side only
        orderStatus: taskData.data?.state || "Created",
      },
    };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}
