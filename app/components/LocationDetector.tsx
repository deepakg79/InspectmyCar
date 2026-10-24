
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    CITY_PRICING,
    type CityName,
} from "@/app/components/city_price";

function getCitySlug(city: CityName): string {
    return String(CITY_PRICING[city].name ?? city)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

export default function LocationDetector() {
    const pathname = usePathname();
    const router = useRouter();
    const checked = useRef(false);

    useEffect(() => {
        // Only detect and redirect from the homepage.
        if (pathname !== "/" || checked.current) return;

        checked.current = true;
        let cancelled = false;

        async function detectCity() {
            try {
                const response = await fetch("/api/location", {
                    cache: "no-store",
                });

                if (!response.ok) return;

                const data: { city?: string | null } =
                    await response.json();

                if (cancelled || !data.city?.trim()) return;

                // Match the detected city against existing configuration.
                const cities = Object.keys(CITY_PRICING) as CityName[];

                const matchedCity = cities.find((city) => {
                    const configuredName = String(
                        CITY_PRICING[city].name ?? city
                    );

                    return (
                        configuredName.trim().toLowerCase() ===
                        data.city!.trim().toLowerCase()
                    );
                });

                // Unknown cities remain on the homepage.
                if (!matchedCity) return;

                // Use the configured city name to construct the existing URL.
                const slug = getCitySlug(matchedCity);

                router.replace(`/${slug}`);
            } catch (error) {
                console.error("Automatic city detection failed:", error);
            }
        }

        void detectCity();

        return () => {
            cancelled = true;
        };
    }, [pathname, router]);

    return null;
}
