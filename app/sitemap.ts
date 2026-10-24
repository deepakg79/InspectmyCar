import type { MetadataRoute } from "next";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://inspectmycar.in";

/**
 * Supported cities
 *
 * These slugs match the CITY_PRICING configuration:
 *
 * Pune
 * Mumbai
 * Nashik
 * Kolhapur
 * Nagpur
 * Chhatrapati Sambhajinagar
 * Solapur
 * Sangli
 * Baramati
 * Satara
 */
const citySlugs = [
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

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    /**
     * ============================================================
     * STATIC PUBLIC PAGES
     * ============================================================
     */

    const staticRoutes = [
        {
            path: "/",
            priority: 1.0,
            changeFrequency: "daily" as const,
        },

        // Main services
        {
            path: "/car-pdi-pune",
            priority: 0.9,
            changeFrequency: "weekly" as const,
        },
        {
            path: "/new-cars",
            priority: 0.9,
            changeFrequency: "weekly" as const,
        },
        {
            path: "/used-cars",
            priority: 0.9,
            changeFrequency: "weekly" as const,
        },

        // Information
        {
            path: "/how-it-works",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/locations",
            priority: 0.8,
            changeFrequency: "weekly" as const,
        },
        {
            path: "/faqs",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/info/pricing",
            priority: 0.9,
            changeFrequency: "weekly" as const,
        },
        {
            path: "/sample-report",
            priority: 0.7,
            changeFrequency: "monthly" as const,
        },

        // New-car content
        {
            path: "/new-cars/buying-guide",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/new-cars/checklist",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/new-cars/pdi-checklist-for-new-car",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/pdi-checklist-for-new-car",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/new-cars/vindecoder",
            priority: 0.7,
            changeFrequency: "monthly" as const,
        },

        // Used-car content
        {
            path: "/used-cars/buying-guide",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/used-cars/checklist",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/used-cars/car-delivery-checklist-pune",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },

        // Other SEO content
        {
            path: "/car-delivery-checklist-pune",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },
        {
            path: "/top-10-mistakes-while-buying-car-in-pune",
            priority: 0.8,
            changeFrequency: "monthly" as const,
        },

        // Booking
        {
            path: "/new-cars/book",
            priority: 0.8,
            changeFrequency: "weekly" as const,
        },

        // Legal
        {
            path: "/cancellation",
            priority: 0.5,
            changeFrequency: "yearly" as const,
        },
        {
            path: "/privacy",
            priority: 0.4,
            changeFrequency: "yearly" as const,
        },
        {
            path: "/terms",
            priority: 0.4,
            changeFrequency: "yearly" as const,
        },
    ];

    /**
     * ============================================================
     * STATIC PAGES
     * ============================================================
     */

    const staticPages: MetadataRoute.Sitemap =
        staticRoutes.map((route) => ({
            url: `${SITE_URL}${route.path}`,
            lastModified: now,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        }));

    /**
     * ============================================================
     * CITY LANDING PAGES
     * ============================================================
     *
     * /pune
     * /mumbai
     * /nashik
     * /kolhapur
     * /nagpur
     * /chhatrapati-sambhajinagar
     * /solapur
     * /sangli
     * /baramati
     * /satara
     */

    const cityPages: MetadataRoute.Sitemap =
        citySlugs.map((slug) => ({
            url: `${SITE_URL}/${slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: slug === "pune" ? 0.95 : 0.9,
        }));

    /**
     * ============================================================
     * CITY CAR-PDI PAGES
     * ============================================================
     */

    const cityCarPdiPages: MetadataRoute.Sitemap =
        citySlugs.map((slug) => ({
            url: `${SITE_URL}/${slug}/car-pdi`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: slug === "pune" ? 0.95 : 0.9,
        }));

    /**
     * ============================================================
     * FINAL SITEMAP
     * ============================================================
     */

    return [
        ...staticPages,
        ...cityPages,
        ...cityCarPdiPages,
    ];
}