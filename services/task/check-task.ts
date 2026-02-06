import axios from "axios";
import crypto from "crypto";

export interface CheckTaskParams {
  creator: string;
  code: string;
  userid: string | number;
  token: string;
}

export interface CheckTaskResponse {
  success: boolean;
  data?: {
    code: string;
    creator: string;
    state: string;
    alreadySent: number;
    target: number;
    repeatedly?: number;
  };
}

/**
 * Check task status via external API
 * This service queries the external API to get current task status
 * 
 * @param params - Task check parameters
 * @returns Task status response
 */
export async function checkTask(
  params: CheckTaskParams
): Promise<CheckTaskResponse> {
  const { creator, code, userid, token } = params;

  let domain = process.env.API_PATH_DOMAIN;
  if (!domain) throw new Error("Missing API_PATH_DOMAIN");

  // Remove protocol if user accidentally included it
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Generate timestamp in seconds
  const ts = Math.floor(Date.now() / 1000);

  // Generate MD5 signature
  const sig = crypto
    .createHash("md5")
    .update(`${creator}${token}${code}${ts}`)
    .digest("hex");

  try {
    const response = await axios({
      url: `http://${domain}/api/task/check`,
      method: "GET",
      params: {
        creator,
        code,
        userid,
        ts,
        sig,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error checking task:", error);
    return { success: false };
  }
}
