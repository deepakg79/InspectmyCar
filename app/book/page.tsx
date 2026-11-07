//app/[city]/page.tsx

import CityLandingClient from "./CityLandingClient";

type PageProps = {
    params: Promise<{
        city: string;
    }>;
};




/**
 * ============================================================
 * SUPPORTED CITY SLUGS
 * ============================================================
 *
 * Keep these in sync with CITY_PRICING.
 */
const CITY_SLUGS = [
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

/**
 * ============================================================
 * STATIC CITY PAGES
 * ============================================================
 */
export function generateStaticParams() {
    return CITY_SLUGS.map((city) => ({
        city,
    }));
}

/**
 * Do not allow unsupported city URLs.
 *
 * Example:
 * /pune                         ✅
 * /mumbai                       ✅
 * /chhatrapati-sambhajinagar   ✅
 * /unknown-city                ❌
 */
export const dynamicParams = false;

/**
 * ============================================================
 * SERVER PAGE
 * ============================================================
 */
export default async function CityPage({
    params,
}: PageProps) {
    const { city } = await params;

    return (
        <CityLandingClient
            citySlug={city}
        />
    );
}