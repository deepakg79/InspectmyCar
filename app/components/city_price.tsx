"use client";

import { useEffect, useState } from "react";

/**
 * ============================================================
 * CITY PRICING CONFIGURATION
 * ============================================================
 *
 * This file is the SINGLE SOURCE OF TRUTH for:
 *
 * - Supported cities
 * - City names
 * - City URL slugs
 * - City badges
 * - New car fuel pricing
 * - EV pricing
 * - Used car pricing
 * - City selection / localStorage
 * - Dynamic city landing-page URLs
 *
 * IMPORTANT:
 *
 * To add a new city later, add ONLY one entry here.
 *
 * Example:
 *
 * Ahmednagar: {
 *     name: "Ahmednagar",
 *     slug: "ahmednagar",
 *     newCarFuel: 1799,
 *     usedCar: 2199,
 *     ev: 1999,
 *     badge: "🚗 Independent Vehicle Inspection Experts in Ahmednagar",
 * },
 *
 * All pages using this helper will automatically support it.
 */

/**
 * ============================================================
 * CITY PRICING
 * ============================================================
 *
 * Base pricing:
 *
 * newCarFuel = Standard new-car PDI with Gauge, without OBD
 *
 * New Car:
 *   Without Gauge = Base - ₹200
 *   With Gauge    = Base
 *   With OBD      = Base + ₹200
 *
 * EV:
 *   Without Gauge = EV Base - ₹200
 *   With Gauge    = EV Base
 *   With OBD      = EV Base + ₹200
 *
 * Used Car:
 *   Standard Used Car = usedCar
 *
 * slug:
 *   Public URL used for the dynamic city landing page.
 *
 * Example:
 *   Pune   -> /pune
 *   Mumbai -> /mumbai
 *   Satara -> /satara
 */

export const CITY_PRICING = {

    Pune: {
        name: "Pune",
        slug: "pune",
        newCarFuel: 1499,
        usedCar: 2499,
        ev: 1799,
        badge: "🚗 Independent Vehicle Inspection Experts in Pune",
    },

    Mumbai: {
        name: "Mumbai",
        slug: "mumbai",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Mumbai",
    },

    Nashik: {
        name: "Nashik",
        slug: "nashik",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Nashik",
    },

    Kolhapur: {
        name: "Kolhapur",
        slug: "kolhapur",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Kolhapur",
    },

    Nagpur: {
        name: "Nagpur",
        slug: "nagpur",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Nagpur",
    },

    ChhatrapatiSambhajinagar: {
        name: "Chhatrapati Sambhajinagar",
        slug: "chhatrapati-sambhajinagar",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Chhatrapati Sambhajinagar",
    },

    Solapur: {
        name: "Solapur",
        slug: "solapur",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Solapur",
    },

    Sangli: {
        name: "Sangli",
        slug: "sangli",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Sangli",
    },

    Baramati: {
        name: "Baramati",
        slug: "baramati",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Baramati",
    },

    Satara: {
        name: "Satara",
        slug: "satara",
        newCarFuel: 1999,
        usedCar: 2899,
        ev: 2299,
        badge: "🚗 Independent Vehicle Inspection Experts in Satara",
    },

} as const;


/**
 * ============================================================
 * DEFAULT CITY
 * ============================================================
 *
 * Pune is shown when:
 *
 * - No city has been selected
 * - localStorage does not contain a city
 * - localStorage contains an invalid city
 * - SSR is being performed
 */

export const DEFAULT_CITY = "Pune";


/**
 * ============================================================
 * LOCAL STORAGE KEY
 * ============================================================
 *
 * This MUST remain "selectedCity" because the existing
 * application already uses this key.
 */

export const CITY_STORAGE_KEY = "selectedCity";


/**
 * ============================================================
 * TYPES
 * ============================================================
 */


/**
 * Supported city names.
 *
 * Example:
 *
 * const city: CityName = "Pune";
 */

export type CityName =
    keyof typeof CITY_PRICING;


/**
 * URL slug used by dynamic city landing pages.
 *
 * Examples:
 *
 * Pune   -> "pune"
 * Mumbai -> "mumbai"
 * Satara -> "satara"
 */

export type CitySlug =
    (typeof CITY_PRICING)[CityName]["slug"];


/**
 * Vehicle category.
 */

export type VehicleType =
    "new" |
    "used";


/**
 * New-car fuel category.
 */

export type FuelType =
    "fuel" |
    "ev";


/**
 * New-car pricing option.
 *
 * withoutGauge:
 *     Base price - ₹200
 *
 * withGauge:
 *     Base price
 *
 * withOBD:
 *     Base price + ₹200
 */

export type NewCarPricingOption =
    | "withoutGauge"
    | "withGauge"
    | "withOBD";


/**
 * ============================================================
 * GET ALL SUPPORTED CITIES
 * ============================================================
 *
 * This is used by dropdowns throughout the application.
 *
 * Adding a city to CITY_PRICING automatically adds it here.
 */

export const getCities = (): CityName[] => {

    return Object.keys(
        CITY_PRICING
    ) as CityName[];

};


/**
 * ============================================================
 * GET CITY BY URL SLUG
 * ============================================================
 *
 * Resolves a public URL slug to the internal CityName.
 *
 * Examples:
 *
 * getCityBySlug("pune")
 *     => "Pune"
 *
 * getCityBySlug("mumbai")
 *     => "Mumbai"
 *
 * getCityBySlug("satara")
 *     => "Satara"
 *
 * Invalid slug:
 *
 * getCityBySlug("unknown")
 *     => null
 */

export const getCityBySlug = (
    slug: string | null | undefined
): CityName | null => {

    if (!slug) {
        return null;
    }

    const normalizedSlug =
        slug
            .trim()
            .toLowerCase();

    const entry =
        Object.entries(
            CITY_PRICING
        ).find(
            ([, pricing]) =>
                pricing.slug.toLowerCase() ===
                normalizedSlug
        );

    if (!entry) {
        return null;
    }

    return entry[0] as CityName;
};


/**
 * ============================================================
 * GET CITY URL
 * ============================================================
 *
 * Returns the public landing-page URL.
 *
 * Examples:
 *
 * getCityUrl("Pune")
 *     => "/pune"
 *
 * getCityUrl("Mumbai")
 *     => "/mumbai"
 *
 * getCityUrl("Satara")
 *     => "/satara"
 */

export const getCityUrl = (
    city: CityName
): string => {

    return `/${CITY_PRICING[city].slug}`;

};


/**
 * ============================================================
 * GET CITY STATIC PARAMS
 * ============================================================
 *
 * Used by Next.js generateStaticParams().
 *
 * This automatically generates:
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

export const getCityStaticParams = () => {

    return getCities().map(
        (city) => ({
            city:
                CITY_PRICING[city].slug,
        })
    );

};


/**
 * ============================================================
 * GET CITY PRICING
 * ============================================================
 *
 * Returns the pricing configuration for a city.
 *
 * If the city is missing or invalid, Pune is returned.
 */

export const getCityPricing = (
    city: string | null | undefined
) => {

    if (
        city &&
        city in CITY_PRICING
    ) {

        return CITY_PRICING[
            city as CityName
        ];

    }

    return CITY_PRICING[
        DEFAULT_CITY
    ];

};


/**
 * ============================================================
 * GET SELECTED CITY
 * ============================================================
 *
 * Reads the selected city from localStorage.
 *
 * SSR safe:
 *
 * During server rendering, Pune is returned.
 */

export const getSelectedCity = (): CityName => {

    if (
        typeof window === "undefined"
    ) {

        return DEFAULT_CITY;

    }

    const savedCity =
        localStorage.getItem(
            CITY_STORAGE_KEY
        );

    if (
        savedCity &&
        savedCity in CITY_PRICING
    ) {

        return savedCity as CityName;

    }

    return DEFAULT_CITY;

};


/**
 * ============================================================
 * SAVE SELECTED CITY
 * ============================================================
 *
 * Saves the selected city to localStorage.
 *
 * Also dispatches a custom event so that other components
 * currently open on the same page can immediately update.
 */

export const setSelectedCity = (
    city: CityName
): void => {

    if (
        typeof window === "undefined"
    ) {

        return;

    }

    localStorage.setItem(
        CITY_STORAGE_KEY,
        city
    );

    window.dispatchEvent(
        new CustomEvent<CityName>(
            "selectedCityChanged",
            {
                detail: city,
            }
        )
    );

};


/**
 * ============================================================
 * NEW CAR PRICE
 * ============================================================
 *
 * Example - Pune Fuel:
 *
 * Base:
 *     ₹1499
 *
 * Without Gauge:
 *     ₹1299
 *
 * With Gauge:
 *     ₹1499
 *
 * With OBD:
 *     ₹1699
 *
 * Example - Pune EV:
 *
 * Base:
 *     ₹1799
 *
 * Without Gauge:
 *     ₹1799
 *
 * With Gauge:
 *     ₹1799
 *
 * With OBD:
 *     ₹1799
 *
 * EV pricing remains fixed because EV has a single price.
 */

export const getNewCarPrice = (
    city: string | null | undefined,
    fuelType: FuelType = "fuel",
    option: NewCarPricingOption = "withGauge"
): number => {

    const pricing =
        getCityPricing(city);


    /**
     * EV has a single fixed price.
     *
     * Gauge / OBD options do not apply to EV.
     */

    if (
        fuelType === "ev"
    ) {

        return pricing.ev;

    }


    /**
     * Fuel vehicle pricing:
     *
     * Without Gauge = Base - ₹200
     * With Gauge    = Base
     * With OBD      = Base + ₹200
     */

    switch (option) {

        case "withoutGauge":

            return (
                pricing.newCarFuel -
                200
            );


        case "withOBD":

            return (
                pricing.newCarFuel +
                200
            );


        case "withGauge":

        default:

            return pricing.newCarFuel;

    }

};


/**
 * ============================================================
 * USED CAR PRICE
 * ============================================================
 */

export const getUsedCarPrice = (
    city: string | null | undefined
): number => {

    return getCityPricing(
        city
    ).usedCar;

};


/**
 * ============================================================
 * LUXURY PRICING
 * ============================================================
 *
 * Luxury pricing is currently NOT city-specific because
 * separate city-wise luxury rates have not been provided.
 *
 * Current rates:
 *
 * New Luxury:
 *     ₹2499
 *
 * Used Luxury:
 *     ₹3299
 *
 * If luxury pricing becomes city-specific later, it can be
 * moved into CITY_PRICING without changing the pages.
 */

export const LUXURY_PRICING = {

    newCar: 2499,

    usedCar: 3299,

} as const;


/**
 * Get new-car luxury price.
 */

export const getNewLuxuryPrice = (): number => {

    return LUXURY_PRICING.newCar;

};


/**
 * Get used-car luxury price.
 */

export const getUsedLuxuryPrice = (): number => {

    return LUXURY_PRICING.usedCar;

};


/**
 * ============================================================
 * FORMAT PRICE
 * ============================================================
 *
 * Converts:
 *
 * 1499  -> 1,499
 * 1999  -> 1,999
 * 2399  -> 2,399
 *
 * Uses Indian number formatting.
 */

export const formatPrice = (
    price: number
): string => {

    return price.toLocaleString(
        "en-IN"
    );

};


/**
 * ============================================================
 * CITY PRICING REACT HOOK
 * ============================================================
 *
 * Usage:
 *
 * const {
 *     selectedCity,
 *     cityPricing,
 *     cities,
 *     setCity,
 *     newCarFuelPrice,
 *     newCarEvPrice,
 *     usedCarPrice,
 *     newLuxuryPrice,
 *     usedLuxuryPrice,
 * } = useCityPricing();
 *
 * Example:
 *
 * const price =
 *     newCarFuelPrice("withOBD");
 *
 * The hook automatically:
 *
 * 1. Loads saved city from localStorage
 * 2. Defaults to Pune
 * 3. Updates when another component changes city
 * 4. Updates when localStorage changes in another tab
 */

export const useCityPricing = () => {

    const [
        selectedCity,
        setSelectedCityState,
    ] = useState<CityName>(
        DEFAULT_CITY
    );


    /**
     * --------------------------------------------------------
     * INITIALIZE CITY + EVENT LISTENERS
     * --------------------------------------------------------
     */

    useEffect(() => {

        /**
         * Load saved city.
         */

        setSelectedCityState(
            getSelectedCity()
        );


        /**
         * ----------------------------------------------------
         * CITY CHANGE EVENT
         * ----------------------------------------------------
         *
         * Handles city changes made by another component
         * in the same browser tab.
         */

        const handleCityChange = (
            event: Event
        ) => {

            const customEvent =
                event as CustomEvent<CityName>;

            if (
                customEvent.detail &&
                customEvent.detail in
                    CITY_PRICING
            ) {

                setSelectedCityState(
                    customEvent.detail
                );

            }

        };


        window.addEventListener(
            "selectedCityChanged",
            handleCityChange
        );


        /**
         * ----------------------------------------------------
         * STORAGE EVENT
         * ----------------------------------------------------
         *
         * Handles city changes from another browser tab.
         */

        const handleStorageChange = (
            event: StorageEvent
        ) => {

            if (
                event.key ===
                CITY_STORAGE_KEY
            ) {

                setSelectedCityState(
                    getSelectedCity()
                );

            }

        };


        window.addEventListener(
            "storage",
            handleStorageChange
        );


        /**
         * ----------------------------------------------------
         * CLEANUP
         * ----------------------------------------------------
         */

        return () => {

            window.removeEventListener(
                "selectedCityChanged",
                handleCityChange
            );

            window.removeEventListener(
                "storage",
                handleStorageChange
            );

        };

    }, []);


    /**
     * Current city's pricing configuration.
     */

    const cityPricing =
        CITY_PRICING[
            selectedCity
        ];


    /**
     * --------------------------------------------------------
     * CHANGE CITY
     * --------------------------------------------------------
     *
     * Updates:
     *
     * - React state
     * - localStorage
     * - other components using the custom event
     */

    const changeCity = (
        city: CityName
    ) => {

        setSelectedCity(
            city
        );

        setSelectedCityState(
            city
        );

    };


    /**
     * --------------------------------------------------------
     * RETURN PUBLIC API
     * --------------------------------------------------------
     */

    return {

        /**
         * Current city key.
         *
         * Example:
         *
         * "Pune"
         */

        selectedCity,


        /**
         * Current city complete configuration.
         */

        cityPricing,


        /**
         * All supported cities.
         */

        cities: getCities(),


        /**
         * Change city.
         */

        setCity: changeCity,


        /**
         * ----------------------------------------------------
         * CITY URL
         * ----------------------------------------------------
         *
         * Example:
         *
         * getCityUrl()
         *     => "/pune"
         */

        cityUrl:
            getCityUrl(
                selectedCity
            ),


        /**
         * Current city slug.
         *
         * Example:
         *
         * "pune"
         */

        citySlug:
            cityPricing.slug,


        /**
         * ----------------------------------------------------
         * NEW CAR FUEL PRICE
         * ----------------------------------------------------
         *
         * Example:
         *
         * newCarFuelPrice()
         *     => Standard with Gauge price
         *
         * newCarFuelPrice("withoutGauge")
         *     => ₹200 less
         *
         * newCarFuelPrice("withOBD")
         *     => ₹200 more
         */

        newCarFuelPrice: (
            option: NewCarPricingOption =
                "withGauge"
        ) =>
            getNewCarPrice(
                selectedCity,
                "fuel",
                option
            ),


        /**
         * ----------------------------------------------------
         * NEW CAR EV PRICE
         * ----------------------------------------------------
         */

        newCarEvPrice: () =>
            getNewCarPrice(
                selectedCity,
                "ev"
            ),


        /**
         * ----------------------------------------------------
         * USED CAR PRICE
         * ----------------------------------------------------
         */

        usedCarPrice: () =>
            getUsedCarPrice(
                selectedCity
            ),


        /**
         * ----------------------------------------------------
         * NEW LUXURY PRICE
         * ----------------------------------------------------
         */

        newLuxuryPrice: () =>
            getNewLuxuryPrice(),


        /**
         * ----------------------------------------------------
         * USED LUXURY PRICE
         * ----------------------------------------------------
         */

        usedLuxuryPrice: () =>
            getUsedLuxuryPrice(),

    };

};