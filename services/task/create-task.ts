import axios from "axios";
import crypto from "crypto";

export interface CreateTaskParams {
  creator: string;
  code: string;
  userid: string | number;
  amount: string | number;
  token: string;
}

export interface CreateTaskResponse {
  success: boolean;
  data: {
    code: string;
    creator: string;
    state: string;
    alreadySent: number;
    target: number;
    repeatedly?: number;
  };
}

/**
 * Create a task via external API
 * This service calls the external task creation API with proper authentication
 * 
 * @param params - Task creation parameters
 * @returns Task creation response
 */
export async function createTask(
  params: CreateTaskParams
): Promise<CreateTaskResponse> {
  const { creator, code, userid, amount, token } = params;

  let domain = process.env.API_PATH_DOMAIN;
  if (!domain) throw new Error("Missing API_PATH_DOMAIN");

  // Remove protocol if user accidentally included it
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Generate timestamp in seconds (matching Postman)
  const ts = Math.floor(Date.now() / 1000);

  // Generate MD5 signature
  const sig = crypto
    .createHash("md5")
    .update(`${creator}${token}${code}${amount}${ts}`)
    .digest("hex");

  const requestBody = {
    creator,
    code,
    userid,
    amount,
    ts,
    sig,
  };

  const response = await axios({
    url: `http://${domain}/api/task/create`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: requestBody,
  });

  return response.data;
}
