import axios from "axios";
import crypto from "crypto";

export default async function createTask(
  creator: string,
  code: string,
  userid: string | number,
  amount: string | number,
  token: string
) {
  const domain = process.env.API_PATH_DOMAIN;
  if (!domain) throw new Error("Missing API_PATH_DOMAIN");

  // ✅ seconds (giống Postman)
  const ts = Math.floor(Date.now() / 1000);

  // ✅ MD5 hex digest giống CryptoJS.MD5(...).toString()
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
  const r = await axios({
    url: `http://${domain}/api/task/create`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: requestBody, // <— this is the “body”
    // transitional: { clarifyTimeoutError: true },
  });
  return await r.data;
}
