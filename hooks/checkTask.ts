import { serverAction } from "@/lib/ultil";
import axios from "axios";
import crypto from "crypto";

export default async function checkTask(
  creator: string,
  code: string,
  userid: string | number,
  token: string
) {
  const domain = process.env.API_PATH_DOMAIN;
  console.log("domain", domain);
  if (!domain) throw new Error("Missing API_PATH_DOMAIN");

  // ✅ seconds (giống Postman)
  const ts = Math.floor(Date.now() / 1000);

  // ✅ MD5 hex digest giống CryptoJS.MD5(...).toString()
  const sig = crypto
    .createHash("md5")
    .update(`${creator}${token}${code}${ts}`)
    .digest("hex");

  const requestBody = {
    creator,
    code,
    userid,
    ts,
    sig,
  };

  const r = await axios({
    url: "http://blue.ilsy.top:2095/api/task/check",
    method: "GET",
    headers: { "Content-Type": "application/json" },
    data: requestBody, // <— this is the “body”
    // transitional: { clarifyTimeoutError: true },
  });
  return await r.data;
}
