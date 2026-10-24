import { Metadata } from "next";
import BrandPageClient from "./BrandPageClient";
import { BRAND_CHECKPOINTS } from "../../components/brandCheckpoints";

type Props = {
    params: Promise<{ brand: string }>;
};

/*
|--------------------------------------------------------------------------
| Supported Brands
|--------------------------------------------------------------------------
|
| Brand images are stored without city suffixes:
|
| /public/brands/tata.jpg
| /public/brands/kia.jpg
| /public/brands/mahindra.jpg
|
| URLs can contain a city:
|
| /pdi/tata-pune
| /pdi/tata-satara
| /pdi/tata-mumbai
|
|--------------------------------------------------------------------------
*/

const SUPPORTED_BRANDS = [
    "maruti-suzuki",
    "maruti",
    "mercedes-benz",
    "land-rover",
    "volkswagen",
    "mahindra",
    "hyundai",
    "toyota",
    "honda",
    "skoda",
    "renault",
    "nissan",
    "tata",
    "kia",
    "mg",
    "jeep",
    "bmw",
    "audi",
    "volvo",
    "jaguar",
    "citroen",
    "byd",
] as const;

/*
|--------------------------------------------------------------------------
| Supported Cities
|--------------------------------------------------------------------------
*/

const SUPPORTED_CITIES = [
    "pune",
    "mumbai",
    "nashik",
    "kolhapur",
    "nagpur",
    "chhatrapati-sambhajinagar",
    "solapur",
    "sangli",
    "baramati",
    "satara",
] as const;

/*
|--------------------------------------------------------------------------
| Get Brand Slug
|--------------------------------------------------------------------------
|
| Examples:
|
| tata-pune      → tata
| tata-satara    → tata
| mahindra-mumbai → mahindra
| maruti-suzuki-pune → maruti-suzuki
|
|--------------------------------------------------------------------------
*/

const getBrandSlug = (slug: string): string => {
    const normalized = slug.trim().toLowerCase();

    const matchedBrand = SUPPORTED_BRANDS.find(
        (brand) =>
            normalized === brand ||
            normalized.startsWith(`${brand}-`)
    );

    return matchedBrand ?? normalized;
};

/*
|--------------------------------------------------------------------------
| Get City Slug
|--------------------------------------------------------------------------
|
| Examples:
|
| tata-pune       → pune
| tata-satara     → satara
| mahindra-mumbai → mumbai
| kia-nashik      → nashik
|
|--------------------------------------------------------------------------
*/

const getCitySlug = (slug: string): string => {
    const normalized = slug.trim().toLowerCase();

    const matchedCity = SUPPORTED_CITIES.find(
        (city) =>
            normalized === city ||
            normalized.endsWith(`-${city}`)
    );

    return matchedCity ?? "pune";
};

/*
|--------------------------------------------------------------------------
| Convert City Slug → Display Name
|--------------------------------------------------------------------------
*/

const getCityName = (slug: string): string => {
    const citySlug = getCitySlug(slug);

    return citySlug
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
};

/*
|--------------------------------------------------------------------------
| Convert Brand Slug → Display Name
|--------------------------------------------------------------------------
*/

const getCleanBrand = (slug: string): string => {
    const brandSlug = getBrandSlug(slug);

    return brandSlug
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
};

/*
|--------------------------------------------------------------------------
| Metadata
|--------------------------------------------------------------------------
*/

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { brand } = await params;

    const brandSlug = getBrandSlug(brand);
    const cleanBrand = getCleanBrand(brand);
    const cityName = getCityName(brand);

    const url = `https://yourdomain.com/pdi/${brand}`;

    return {
        title: `Expert ${cleanBrand} PDI Services in ${cityName} | InspectMyCar`,

        description:
            `Professional 400 point Pre-Delivery Inspection for ${cleanBrand} cars in ${cityName}. Don't take delivery without a certified expert check.`,

        alternates: {
            canonical: url,
        },

        openGraph: {
            title: `Expert ${cleanBrand} PDI Services in ${cityName}`,

            description:
                `Book certified ${cleanBrand} car inspection in ${cityName}.`,

            url,

            siteName: "InspectMyCar",

            images: [
                {
                    url: `/brands/${brandSlug}.jpg`,
                    width: 1200,
                    height: 630,
                },
            ],

            locale: "en_IN",

            type: "website",
        },
    };
}

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default async function BrandPDIPage({
    params,
}: Props) {
    const { brand: rawBrand } = await params;

    /*
     * Example:
     *
     * rawBrand = "mahindra-satara"
     *
     * brandSlug  = "mahindra"
     * displayBrand = "Mahindra"
     * cityName = "Satara"
     */

    const brandSlug = getBrandSlug(rawBrand);

    const displayBrand = getCleanBrand(rawBrand);

    const cityName = getCityName(rawBrand);

    /*
     * Get brand-specific checkpoints.
     *
     * Example:
     *
     * BRAND_CHECKPOINTS["mahindra"]
     *
     * If no brand-specific checklist exists,
     * fall back to the general checklist.
     */

    const checkpoints =
        BRAND_CHECKPOINTS[brandSlug] ||
        BRAND_CHECKPOINTS.general;

    return (
        <main className="bg-main min-h-screen text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            {/* =========================================================
                HERO SECTION
            ========================================================= */}

            <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-40 lg:grid-cols-2">

                {/* =====================================================
                    HERO CONTENT
                ===================================================== */}

                <div className="slide-up text-center lg:text-left">

                    {/* Location / Brand Badge */}

                    <div className="card-glass mb-8 inline-flex items-center gap-2 rounded-full border-indigo-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                        📍 {displayBrand} Specialists in {cityName}
                    </div>

                    {/* Main Heading */}

                    <h1 className="heading mb-8 text-5xl leading-[0.95] md:text-7xl">
                        Buying a New
                        <br />

                        <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                            {displayBrand}?
                        </span>

                        <br />

                        Inspect It First.
                    </h1>

                    {/* Description */}

                    <p className="subtext mx-auto mb-10 max-w-xl text-lg font-medium leading-relaxed lg:mx-0">
                        Expert 200+ point PDI for all{" "}
                        {displayBrand} models across{" "}
                        {cityName} dealerships. We identify
                        transit damage, repainted panels, and
                        electronic glitches.
                    </p>

                    {/* Booking / CTA */}

                    <BrandPageClient
                        brand={displayBrand}
                    />
                </div>

                {/* =====================================================
                    HERO IMAGE
                ===================================================== */}

                <div className="relative slide-up">

                    <div className="group relative overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl">

                        <img
                            src={`/brands/${brandSlug}.jpg`}
                            alt={`${displayBrand} inspection in ${cityName}`}
                            className="h-[500px] w-full object-cover transition duration-500 group-hover:scale-110"
                        />

                        {/* Certified Badge */}

                        <div className="card-glass absolute -bottom-6 -right-6 border-white p-6 shadow-xl">

                            <p className="text-2xl font-black text-indigo-600">
                                Certified
                            </p>

                            <p className="subtext text-[10px] font-bold uppercase tracking-widest">
                                {displayBrand} PDI Expert
                            </p>

                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                DYNAMIC CHECKLIST SECTION
            ========================================================= */}

            <section className="mx-auto max-w-6xl border-t border-slate-100 px-6 py-24">

                <div className="mb-16 text-center">

                    <h2 className="heading mb-4 text-4xl">
                        Our {displayBrand} Specializations
                    </h2>

                    <p className="subtext">
                        Specifically curated for{" "}
                        {displayBrand}&apos;s common factory
                        and transit issues.
                    </p>

                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {checkpoints.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >

                                {/* Check Icon */}

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">

                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>

                                </div>

                                {/* Checkpoint */}

                                <div>

                                    <p className="font-bold leading-tight text-slate-900">
                                        {item}
                                    </p>

                                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Critical Checkpoint
                                    </p>

                                </div>

                            </div>
                        )
                    )}

                </div>
            </section>
        </main>
    );
}