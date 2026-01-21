import { cachedReq, formatDateTime } from "@/lib/utils";
import axios from "axios";
import crypto from "crypto";

interface CreateTaskResponse {
  success: boolean;
  data: {
    code: string;
    creator: string;
    state: string;
    alreadySent: number;
    target: number;
    repeatedly?: number; // Optional: nếu có thì return
  };
}

// Vietnamese keys from checkBank API
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

// English keys for Google Sheet
interface BankTransactionEnglish {
  gateway: string;           // Ngân hàng
  transaction_date: string;  // Ngày giao dịch
  account_number: string;    // Số tài khoản
  sub_account: string;       // Tài khoản phụ
  code_tt: string;          // Code TT
  content: string;          // Nội dung thanh toán
  type: string;             // Loại
  amount: number;           // Số tiền
  transaction_id: string;   // Mã tham chiếu
  balance: number;          // Lũy kế
}

// Merged data structure for Google Sheet
interface SheetRowData {
  code: string;              // CODE (from task)
  target: number;            // AMOUNT/TARGET (số lượng tim)
  alreadySent: number;       // ALREADYSENT (số tim đã gửi)
  money: number;             // MONEY (số tiền)
  bankCode: string;          // BANK_CODE (gateway)
  refCode: string;           // REF_CODE (transaction_id)
  timeCreate: string;        // TIME_CREATE
  orderStatus: string;       // ORDER_STATUS
  bankTime: string;          // BANK_TIME (transaction_date)
  doneTime: string;          // DONE_TIME
}

interface MergedTaskResponse {
  success: boolean;
  data: {
    // Task data from createTask API
    task: {
      code: string;
      creator: string;
      state: string;
      alreadySent: number;
      target: number;
      repeatedly?: number; // Optional: nếu có thì return
    };
    // Bank transactions with English keys
    bankTransactions: BankTransactionEnglish[];
    // Latest transaction with English keys
    latestTransaction: BankTransactionEnglish | null;
    // Merged data ready for Google Sheet
    sheetData: SheetRowData;
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

export default async function createTaskWithBank(
  creator: string,
  code: string,
  userid: string | number,
  amount: string | number,
  token: string
): Promise<MergedTaskResponse> {
  const domain = process.env.API_PATH_DOMAIN;
  const gsheetBase = process.env.NEXT_PUBLIC_GSHEET_WEBAPP_URL;
  const gsheetToken = process.env.NEXT_PUBLIC_GSHEET_API_TOKEN;

  if (!domain) throw new Error("Missing API_PATH_DOMAIN");
  if (!gsheetBase) throw new Error("Missing NEXT_PUBLIC_GSHEET_WEBAPP_URL");
  if (!gsheetToken) throw new Error("Missing NEXT_PUBLIC_GSHEET_API_TOKEN");

  // Timestamp in seconds
  const ts = Math.floor(Date.now() / 1000);

  // Generate signature
  const sig = crypto
    .createHash("md5")
    .update(`${creator}${token}${code}${amount}${ts}`)
    .digest("hex");

  // Prepare createTask request
  const createTaskRequest = axios({
    url: `http://${domain}/api/task/create`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: {
      creator,
      code,
      userid,
      amount,
      ts,
      sig,
    },
  });

  const checkBankRequest = cachedReq('/api/checkBank');

  // Execute both requests in parallel for optimal performance
  const [taskResponse, bankResponse] = await Promise.all([
    createTaskRequest,
    checkBankRequest,
  ]);

  const taskData: CreateTaskResponse = taskResponse.data;
  const bankData = bankResponse; // cachedReq already returns parsed JSON

  // Parse bank transactions and convert to English keys
  const rawTransactions: BankTransactionRaw[] = Array.isArray(bankData.data)
    ? bankData.data
    : [];

  const transactions: BankTransactionEnglish[] = rawTransactions.map(
    convertBankTransaction
  );

  // Find transaction matching the code from form
  // Check if transaction content includes the code (e.g., "ACH/TEST-ABC123")
  const matchingTransaction = transactions.find(
    (t) => t.content && t.content.includes(code)
  );
  
  console.log("Matching transaction for code:", code, matchingTransaction);
  // Create merged data for Google Sheet
  const now = new Date();
  const sheetData: SheetRowData = {
    code: taskData.data.code,
    target: taskData.data.target,
    alreadySent: taskData.data.alreadySent,
    money: matchingTransaction?.amount || 0,
    bankCode: matchingTransaction?.gateway || "",
    refCode: "",
    timeCreate: await formatDateTime(now),
    orderStatus: taskData.data.state,
    bankTime: matchingTransaction?.transaction_date || "",
    doneTime: '',
  };

  console.log("Task created:", taskData.data);
  console.log("Matching bank transaction:", matchingTransaction);
  console.log("Sheet data:", sheetData);

  return {
    success: true,
    data: {
      task: {
        ...taskData.data,
        
      },
      bankTransactions: transactions,
      latestTransaction: matchingTransaction || null,
      sheetData,
    },
  };
}

