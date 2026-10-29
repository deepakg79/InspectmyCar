import { db } from "@/app/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    doc,
    setDoc,
} from "firebase/firestore";

import {
    DEFAULT_CITY,
    getCities,
    type CityName,
} from "@/app/components/city_price";
import { isPastSlot } from "@/app/lib/slotConfig";

const BOOKINGS = "bookings";
const INSPECTOR_COUNT = "inspector_count";
const INSPECTORS = "inspectors";


/**
 * Return today's date in the business timezone (India), as YYYY-MM-DD.
 * Do not use toISOString() for "today": it uses UTC and can be one day
 * behind the Indian calendar date between midnight and 05:29 IST.
 */
export const getIndiaDateString = (date: Date = new Date()): string => {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const part = (type: string) =>
        parts.find((item) => item.type === type)?.value ?? "";

    return `${part("year")}-${part("month")}-${part("day")}`;
};

/**
 * Convert Firestore date values to the YYYY-MM-DD key used by the calendar.
 * Supports the app's existing string field, ISO date/time strings, Dates,
 * and Firestore Timestamp-like objects.
 */
const normalizeBookingDate = (value: unknown): string => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return getIndiaDateString(value);
    }

    if (value && typeof value === "object" && "toDate" in value) {
        const toDate = (value as { toDate?: () => Date }).toDate;
        if (typeof toDate === "function") {
            try {
                const date = toDate.call(value);
                if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    return getIndiaDateString(date);
                }
            } catch {
                // Fall through to string handling.
            }
        }
    }

    if (typeof value !== "string") return "";

    const raw = value.trim();
    if (!raw) return "";

    // Preserve date-only values exactly; parsing them as Date can shift dates.
    const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})(?:$|T|\s)/);
    if (isoDate) return isoDate[1];

    // Support legacy DD/MM/YYYY or DD-MM-YYYY values if any exist.
    const localDate = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (localDate) {
        const day = localDate[1].padStart(2, "0");
        const month = localDate[2].padStart(2, "0");
        return `${localDate[3]}-${month}-${day}`;
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? "" : getIndiaDateString(parsed);
};

/*
 * inspector_count is intentionally NOT tied to a hardcoded Firestore
 * document ID.
 *
 * Expected structure:
 *
 * inspector_count
 *   └── <dynamic document ID>
 *       ├── Pune: 2
 *       ├── Mumbai: 3
 *       ├── Nashik: 1
 *       └── ...
 *
 * The inspectors collection is the source of truth.
 * inspector_count is a maintained/derived capacity document.
 *
 * If the count document is deleted, it is automatically recreated from
 * the active inspectors collection.
 */

/*
 * Bookings created before city support are treated as Pune.
 */
const normalizeCity = (city: unknown): CityName => {
    const cities = getCities();

    if (
        typeof city === "string" &&
        cities.includes(city as CityName)
    ) {
        return city as CityName;
    }

    return DEFAULT_CITY;
};

/**
 * Normalize slot values.
 */
const normalizeSlot = (slot: unknown): string => {
    return (
        slot
            ?.toString()
            .trim()
            .replace(/^0/, "") || ""
    );
};

/**
 * Active booking states consume inspector capacity.
 *
 * Cancelled / Canceled / Completed are terminal states and release
 * capacity.
 */
const consumesInspectorCapacity = (
    status: unknown
): boolean => {
    const normalizedStatus = String(
        status || "Confirmed"
    )
        .trim()
        .toLowerCase();

    return (
        normalizedStatus !== "cancelled" &&
        normalizedStatus !== "canceled" &&
        normalizedStatus !== "completed"
    );
};

/* -------------------------------------------------------------------------- */
/* Inspector Count                                                            */
/* -------------------------------------------------------------------------- */

type InspectorCountMap = Record<CityName, number>;

/**
 * Create an empty count map for every city configured in city_price.tsx.
 */
const createEmptyInspectorCounts = (): InspectorCountMap => {
    const counts = {} as InspectorCountMap;

    for (const city of getCities()) {
        counts[city] = 0;
    }

    return counts;
};

/**
 * Read the single inspector_count document dynamically.
 *
 * There is intentionally no hardcoded Firestore document ID.
 *
 * Returns:
 *   - the existing document snapshot when present
 *   - null when the collection is empty
 */
const getInspectorCountDocument = async () => {
    const snapshot = await getDocs(
        collection(db, INSPECTOR_COUNT)
    );

    if (snapshot.empty) {
        return null;
    }

    /*
     * The application expects one document.
     * If more than one exists because of an old/manual setup,
     * use the first document consistently rather than inventing
     * another ID.
     */
    return snapshot.docs[0];
};

/**
 * Rebuild inspector_count from the inspectors collection.
 *
 * Active inspectors only contribute to capacity.
 *
 * This is the source-of-truth operation used by:
 * - inspector administration
 * - automatic recovery when inspector_count is missing
 */
export const syncInspectorCounts = async (): Promise<string> => {
    const inspectorSnapshot = await getDocs(
        collection(db, INSPECTORS)
    );

    const counts = createEmptyInspectorCounts();

    inspectorSnapshot.forEach((inspectorDoc) => {
        const data = inspectorDoc.data();

        if (String(data.status || "").trim() !== "Active") {
            return;
        }

        // Inspectors with city set to "Unknown" must not contribute to
        // any configured city's capacity (including DEFAULT_CITY).
        const rawCity =
            typeof data.city === "string"
                ? data.city.trim()
                : "";

        if (rawCity.toLowerCase() === "unknown") {
            return;
        }

        const city = normalizeCity(data.city);
        counts[city] += 1;
    });

    const existingCountDocument =
        await getInspectorCountDocument();

    const payload: Record<string, number> = {};

    for (const city of getCities()) {
        payload[city] = counts[city];
    }

    if (existingCountDocument) {
        await setDoc(
            doc(
                db,
                INSPECTOR_COUNT,
                existingCountDocument.id
            ),
            payload,
            { merge: false }
        );

        return existingCountDocument.id;
    }

    const created = await addDoc(
        collection(db, INSPECTOR_COUNT),
        payload
    );

    return created.id;
};

/**
 * Get the active inspector count for a city.
 *
 * If inspector_count is missing, rebuild it automatically from
 * inspectors and then read the requested city.
 *
 * A configured city with zero active inspectors returns zero.
 * This is important: zero inspectors means the city has no capacity.
 */
export const getInspectorCount = async (
    city: CityName
): Promise<number> => {
    const normalizedCity = normalizeCity(city);

    let countDocument =
        await getInspectorCountDocument();

    if (!countDocument) {
        await syncInspectorCounts();

        countDocument =
            await getInspectorCountDocument();
    }

    if (!countDocument) {
        /*
         * This should only be reachable if Firestore write/read failed
         * between the two operations. Do not silently invent capacity.
         */
        return 0;
    }

    const rawCount =
        countDocument.data()?.[normalizedCity];

    const count = Number(rawCount);

    if (
        !Number.isFinite(count) ||
        count < 0
    ) {
        /*
         * If an older/malformed count document exists, rebuild it from
         * the actual inspectors before deciding the capacity.
         */
        await syncInspectorCounts();

        const refreshed =
            await getInspectorCountDocument();

        const refreshedCount = Number(
            refreshed?.data()?.[normalizedCity]
        );

        if (
            Number.isFinite(refreshedCount) &&
            refreshedCount >= 0
        ) {
            return Math.floor(refreshedCount);
        }

        return 0;
    }

    return Math.floor(count);
};

/* -------------------------------------------------------------------------- */
/* Booking Availability                                                       */
/* -------------------------------------------------------------------------- */

export type BookingAvailability = {
    availability: Record<
        string,
        Record<string, number>
    >;
    bookings: Record<string, string[]>;
    inspectorCount: number;
};

export type SlotAvailability = {
    available: boolean;
    remaining: number;
    inspectorCount: number;
    bookingCount: number;
};

/**
 * Get booking availability for a specific city.
 */
export const getBookingsAndAvailability = async (
    city: CityName = DEFAULT_CITY
): Promise<BookingAvailability> => {
    const today = getIndiaDateString();
    const normalizedCity = normalizeCity(city);
    const inspectorCount = await getInspectorCount(normalizedCity);

    /*
     * Normalize/filter dates in JavaScript instead of relying on Firestore's
     * string comparison. This handles YYYY-MM-DD strings and legacy date types.
     */
    const snapshot = await getDocs(collection(db, BOOKINGS));
    const bookingCountMap: Record<string, Record<string, number>> = {};

    snapshot.forEach((bookingDoc) => {
        const data = bookingDoc.data();
        const date = normalizeBookingDate(data.date);
        const slot = normalizeSlot(data.slot);

        if (!date || date < today || !slot) return;
        if (!consumesInspectorCapacity(data.status)) return;
        if (normalizeCity(data.city) !== normalizedCity) return;

        if (!bookingCountMap[date]) bookingCountMap[date] = {};
        bookingCountMap[date][slot] = (bookingCountMap[date][slot] || 0) + 1;
    });

    const availability: Record<string, Record<string, number>> = {};
    Object.entries(bookingCountMap).forEach(([date, slots]) => {
        availability[date] = {};
        Object.entries(slots).forEach(([slot, bookingCount]) => {
            availability[date][slot] = Math.max(inspectorCount - bookingCount, 0);
        });
    });

    const bookings: Record<string, string[]> = {};
    Object.entries(availability).forEach(([date, slots]) => {
        const fullSlots = Object.entries(slots)
            .filter(([, remaining]) => remaining <= 0)
            .map(([slot]) => slot);
        if (fullSlots.length > 0) bookings[date] = fullSlots;
    });

    return { bookings, availability, inspectorCount };
};

/* -------------------------------------------------------------------------- */
/* Check Single Slot Availability                                             */
/* -------------------------------------------------------------------------- */

export const checkSlotAvailability = async (
    data: {
        city?: CityName;
        date: string;
        slot: string;
    }
): Promise<SlotAvailability> => {
    const city = normalizeCity(data.city);
    const inspectorCount = await getInspectorCount(city);
    const targetDate = normalizeBookingDate(data.date);
    const slot = normalizeSlot(data.slot);

    if (targetDate && slot && isPastSlot(targetDate, slot)) {
        return {
            available: false,
            remaining: 0,
            inspectorCount,
            bookingCount: 0,
        };
    }

    const snapshot = await getDocs(collection(db, BOOKINGS));
    let bookingCount = 0;

    snapshot.forEach((bookingDoc) => {
        const booking = bookingDoc.data();

        if (!consumesInspectorCapacity(booking.status)) return;
        if (normalizeCity(booking.city) !== city) return;
        if (normalizeBookingDate(booking.date) !== targetDate) return;
        if (normalizeSlot(booking.slot) !== slot) return;

        bookingCount += 1;
    });

    const remaining = Math.max(inspectorCount - bookingCount, 0);
    return {
        available: remaining > 0,
        remaining,
        inspectorCount,
        bookingCount,
    };
};

/* -------------------------------------------------------------------------- */
/* Create Booking                                                             */
/* -------------------------------------------------------------------------- */

export const createBooking = async (data: {
    type?: string;

    name: string;
    mobile: string;

    date: string;
    slot: string;

    location?: string;
    fullAddress: string;

    city?: CityName;

    brand?: string;
    model?: string;

    year?: number;

    fuelType?: string;

    message?: string;

    price?: number;
}): Promise<void> => {
    const city =
        normalizeCity(data.city);

    const slot =
        normalizeSlot(data.slot);

    if (!data.date) {
        throw new Error("Date is required");
    }

    if (!slot) {
        throw new Error("Slot is required");
    }

    /*
     * Make sure the derived inspector_count document exists and
     * represents the current inspector collection.
     */
    const inspectorCount =
        await getInspectorCount(city);

    const targetDate = normalizeBookingDate(data.date);
    if (!targetDate) {
        throw new Error("Date must be a valid date in YYYY-MM-DD format.");
    }

    if (isPastSlot(targetDate, slot)) {
        throw new Error("This time slot has already passed in India time. Please select a future slot.");
    }

    const existingBookings = await getDocs(collection(db, BOOKINGS));
    let bookingCount = 0;

    existingBookings.forEach((bookingDoc) => {
        const booking = bookingDoc.data();

        if (!consumesInspectorCapacity(booking.status)) return;
        if (normalizeCity(booking.city) !== city) return;
        if (normalizeBookingDate(booking.date) !== targetDate) return;
        if (normalizeSlot(booking.slot) !== slot) return;

        bookingCount += 1;
    });

    if (
        bookingCount >=
        inspectorCount
    ) {
        throw new Error(
            `Slot already full for ${city}.`
        );
    }

    /*
     * Final availability re-check immediately before writing.
     */
    const latestAvailability =
        await checkSlotAvailability({
            city,
            date: data.date,
            slot,
        });

    if (!latestAvailability.available) {
        throw new Error(
            `Slot already full for ${city}.`
        );
    }

    await addDoc(
        collection(db, BOOKINGS),
        {
            ...data,
            city,
            slot,
            fullAddress:
                data.fullAddress || "",
            status: "Confirmed",
            assignedTo: "",
            createdAt:
                serverTimestamp(),
        }
    );
};