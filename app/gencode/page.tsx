
import { cachedReq } from "@/lib/ultil";
import { generateCode, isValidGenerateCode } from "@/lib/verifycode";

export default async function Gencode() {
    const code = generateCode();
    const verifyCode = isValidGenerateCode(code);
    // Server components cannot use relative URLs for fetch.
    // Ensure you are running on port 3000 or update the base URL.
    // Server components require an absolute URL for internal API calls.
    // If you deploy this, you'll need to use the actual domain instead of localhost.
    const res = await cachedReq(`/api/sheet`);
    const data = res.data;
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
                <p>Code: {code}</p>
                <p>Valid: {verifyCode.toString()}</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div >
        </>
    )
} 