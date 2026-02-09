import { fetchPricing } from "@/lib/pricing";
import { customRound } from "@/lib/pricing-helpers";
import HeartPacksClient from "./heart-packs-client";


export default async function HeartPacks() {
    // Fetch pricing from PRICE sheet
    const pricing = await fetchPricing();

    const packs = [
        {
            id: "starter",
            name: "30 Hearts Pack",
            hearts: 30,
            priceNum: pricing.getPrice(30),
            price: `${pricing.getPrice(30).toLocaleString('vi-VN')}đ`,
            oldPrice: `${(Math.ceil(((30 * pricing.pricePerHeart) / 3) / 100) * 100).toLocaleString('vi-VN')}đ`,
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOaDSVrPrgC9HRHJWUBPH_RGvyRT20vBA87qGfMRFm5BFYZ_pQJxlhjV3kJeNdh6MrTvnG7LnmNwf_KzMwsXDWsyDTTb4ZMuSGxk0BBOVuDAnY1KfayGr0zyVwhOgvls4rsfUiqUvTSHqMqT4EOgtGLmqidjFESkzzhNE3MTfmGv4fDJaUEJs0Tzv6saDzlG_NiIVY5gTNdLYqDX297OajuFJcmabxpje4umkxhdgEse6mSHtEvVhHKLyWTekxacLs0UsBRcMmFls",
            tag: "Starter",
            category: "Starter Pack"
        },
        {
            id: "popular",
            name: "100 Hearts Pack",
            hearts: 100,
            priceNum: pricing.getPrice(100),
            price: `${pricing.getPrice(100).toLocaleString('vi-VN')}đ`,
            oldPrice: `${(Math.ceil(((100 * pricing.pricePerHeart) / 3) / 100) * 100).toLocaleString('vi-VN')}đ`,
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwQ5EFQUyjdhMURYLZ8mQX2cAPwB7o2I-ffokJLOd-4-Ze76DTWUFyIQLeeQJfr9K2zqaY77-KqKd0HUgC6pveiBQaUr7SLPhI45GUn8UfPLhIiq6UFaiMJhx2tA-HpiMfnnb0tVFvUebvUxgt4_7cVgzpwjsoHDpafDNoEnp30Lib_k63xhKv42a6vw1152i5WYmCMz223me5LRJBaeYfBUeGkJHKgo9BldF4BpAyPolRXxHI-LBoMB86p9-oOaN0F6r__wDkjBE",
            tag: "POPULAR",
            isPopular: true,
            category: "Popular Pack"
        },
        {
            id: "seller",
            name: "170 Hearts Pack",
            hearts: 170,
            priceNum: pricing.getPrice(170),
            price: `${pricing.getPrice(170).toLocaleString('vi-VN')}đ`,
            oldPrice: `${(Math.ceil(((170 * pricing.pricePerHeart) / 3) / 100) * 100).toLocaleString('vi-VN')}đ`,
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIHZPOPluZovRodtYx7O2fPaqhpgh9m3dqMjinOGY8b5UsahGfST7tnXNTTpnBQEI_8LpmyNUyAS-O16AHBfOjCQyTOAkL2tMmOtc5XFx_LUPq8_a15MaKd5BFL6lCzMiPZA1kSJ-NZAOJfw5Xv4By9cVQwQK3vuK8QN77zm9exCr7BSS2aniIzF1-1hqPhZQsEit5aTqPALR2TA5uTmodtSIVfdudlxpi9BGYIOlLCaKqy0GAVe3AZuOMvVuvcAq55EwZSS2f-gs",
            tag: "BEST SELLER",
            isBestSeller: true,
            category: "Best Seller Pack"
        },
        {
            id: "value",
            name: "360 Hearts Pack",
            hearts: 360,
            priceNum: pricing.getPrice(360),
            price: `${pricing.getPrice(360).toLocaleString('vi-VN')}đ`,
            oldPrice: `${(Math.ceil(((360 * pricing.pricePerHeart) / 3) / 100) * 100).toLocaleString('vi-VN')}đ`,
            bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuIUNxThKY85Sd4FocTUIv-JY1ifZ9EN3C8iRM7SpFx-iqK_QpIlM19VIgXZsbWQJIzwE-1qjUvx5bPzr7IN5n4hgVcr4jE4iti6e6WrFrHthpcj-T7A0t_5rfq0yhmbX-YLbSWATXZdiv2qf95TVlUzi2xFdtEOY1wVJuBuM2aUV9k0_J1YQsgzp3jUSJbGwpR0tJDy6f0UuD5vuINfIUz0KTtgkub_r9TUgIuOuWlJyrfvt6SKo_n36Zaeo30jBN_3m-K3lvWmA",
            tag: "BEST VALUE",
            isBestValue: true,
            category: "Best Value"
        }
    ];

    return <HeartPacksClient packs={packs} />;
}
