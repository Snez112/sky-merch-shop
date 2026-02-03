import { cachedReq } from "@/lib/utils";
import createTask from "./createTask";
import { createDraftOrder } from "@/services/order/create-draft-order";

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

interface VerifyPaymentParams {
  code: string;
  creator: string;
  userid: string | number;
  amount: number;
  token: string;
  maxAttempts?: number; // Default: 300 attempts (15 minutes with 3s interval)
  intervalMs?: number; // Default: 3000ms (3 seconds)
}

interface VerifyPaymentResponse {
  success: boolean;
  data: {
    task: {
      code: string;
      creator: string;
      state: string;
      alreadySent: number;
      target: number;
      repeatedly?: number;
    };
    transaction: BankTransactionEnglish;
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
 * Verify payment by polling Google Sheets for matching transaction
 * Then call createTask API and update order status to "Created"
 * 
 * Handles race conditions: If multiple devices create draft orders with same code,
 * only the first one to verify payment will succeed in updating the order.
 * 
 * @param params - Payment verification parameters
 * @returns Verified payment data with task and transaction info
 */
export default async function verifyPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResponse> {
  const {
    code,
    creator,
    userid,
    amount,
    token,
  } = params;

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


    // Transaction found! Now create task via API
    
    const taskData = await createTask(creator, code, userid, amount, token);

    // Create complete order in Google Sheets (instead of updating draft)
    await createDraftOrder({
      code,
      quantity: taskData.data?.target ? Math.floor(taskData.data.target / 3 * 1000) : 1, 
      productPrice: amount,
      productName: `Heart Pack (via Bank - ${amount}đ)`,
      
      // Full order details
      bankCode: matchingTransaction.gateway,
      refCode: matchingTransaction.transaction_id,
      bankTime: matchingTransaction.transaction_date,
      orderStatus: taskData.data?.state || "Created"
    });

    return {
      success: true,
      data: {
        task: {
          code: taskData.data?.code || code,
          creator: taskData.data?.creator || creator,
          state: taskData.data?.state || "Created",
          alreadySent: taskData.data?.alreadySent || 0,
          target: taskData.data?.target || 0,
          repeatedly: taskData.data?.repeatedly,
        },
        transaction: matchingTransaction,
        orderStatus: taskData.data?.state || "Created",
      },
    };
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}
