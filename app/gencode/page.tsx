
import checkTask from "@/hooks/checkTask";
import { cachedReq } from "@/lib/utils";
import { generateCode, isValidGenerateCode } from "@/lib/validation";
import CryptoJS from "crypto-js";
export default async function Gencode() {
    const code1 = generateCode();
    const verifyCode = isValidGenerateCode(code1);
    // Server components cannot use relative URLs for fetch.
    // Ensure you are running on port 3000 or update the base URL.
    // Server components require an absolute URL for internal API calls.
    // If you deploy this, you'll need to use the actual domain instead of localhost.
    const res = await cachedReq(`/api/sheet?sheet_name=LIST`);
    const data = res.data;
    console.log(data)
    const ts = Math.floor(Date.now() / 1000);

    return (
        <>
            {data.map((item: any) => {
                return (
                    <div key={item.code}>
                        <h1>{item.code}: <span>{item.price}</span></h1>

                        <p>{item.valid}</p>
                    </div>
                )
            })}
            <div>
                <h1>Gencode</h1>
                <p>Code: {code1}</p>
                <p>Valid: {verifyCode.toString()}</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div >
        </>
    )
} 